import supabase from "../supabase.js";

const entry_keys = 'entry_id, title, content, category ,creator_id, created_at, updated_at';

//Display a summary of journal entries over a selected period i.e. daily, weekly, monthly. 
export const getSummaries = async (req, res) => {
    const { startDate, endDate } = req.query;

    let query = supabase.from('entries').select(entry_keys)
        .eq('creator_id', req.user.id)
        .is('deleted_at', null);

    if (startDate) {
        const isoStartDate = new Date(startDate).toISOString();
        query = query.gte('created_at', isoStartDate);
    }

    if (endDate) {
        const isoEndDate = new Date(endDate).toISOString();
        query = query.lte('created_at', isoEndDate);
    }

    //get insights - number of entries, most used category, average number of words per entry, average number of entries per day within the selected period
    //get insights - number of entries
    const { data: entries, error: entriesError } = await query;
    if (entriesError) {
        return res.status(400).json({ error: entriesError.message });
    }
    const numberOfEntries = entries.length;

    //get insights - most used category
    const categoryCount = {};
    entries.forEach(entry => {
        const category = entry.category.toLowerCase();
        categoryCount[category] = categoryCount[category] ? categoryCount[category] + 1 : 1;
    });

    const mostUsedCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);

    //get insights - average number of words per entry
    const totalWords = entries.reduce((acc, entry) => acc + entry.content.split(' ').length, 0);
    const averageWordsPerEntry =  Math.ceil(totalWords / numberOfEntries);

    //get insights - average number of entries per day rounded up to the nearest whole number
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const averageEntriesPerDay = Math.ceil(numberOfEntries / days);

    return res.status(200).json({
        numberOfEntries,
        mostUsedCategory,
        averageWordsPerEntry,
        averageEntriesPerDay
    });

};
