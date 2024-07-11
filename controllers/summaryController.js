import supabase from "../supabase.js";

const entry_keys = 'entry_id, title, content, category ,creator_id, created_at, updated_at';

//Summary of journal entries over a selected period i.e. daily, weekly, monthly. 
export const getSummaries = async (req, res) => {
    const { startDate, endDate } = req.query;

    let query = supabase
        .from('entries')
        .select(entry_keys)
        .eq('creator_id', req.user.id)
        .is('deleted_at', null).lte('created_at', endDate).gte('created_at', startDate);

    // Execute query and handle errors
    const { data: entries, error: entriesError } = await query;

    if (entriesError) {
        return res.status(400).json({ error: entriesError.message });
    }

    if (!entries || entries.length === 0) {
        return res.status(200).json({
            numberOfEntries: 0,
            mostUsedCategory: "None",
            averageWordsPerEntry: 0,
            averageEntriesPerDay: 0,
        });
    }

    // Get insights - number of entries
    const numberOfEntries = entries.length;

    // Get insights - most used category
    const categoryCount = {};
    entries.forEach(entry => {
        const category = entry.category ? entry.category.toLowerCase() : 'uncategorized';
        categoryCount[category] = categoryCount[category] ? categoryCount[category] + 1 : 1;
    });
    const mostUsedCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);

    // Get insights - average number of words per entry
    const totalWords = entries.reduce((acc, entry) => acc + entry.content.split(' ').length, 0);
    const averageWordsPerEntry = Math.ceil(totalWords / numberOfEntries);

    // Get insights - average number of entries per day
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const averageEntriesPerDay = Math.ceil(numberOfEntries / days);

    return res.status(200).json({
        numberOfEntries,
        mostUsedCategory,
        averageWordsPerEntry,
        averageEntriesPerDay,
    });
};
