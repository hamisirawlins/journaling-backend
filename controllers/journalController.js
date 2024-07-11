import supabase from '../supabase.js';
import { paginate } from '../utils/pagination.js';
import { v4 as uuidv4 } from 'uuid';

const entry_keys = 'entry_id, title, content, category ,creator_id, created_at, updated_at';
export const createEntry = async (req, res) => {
    const { title, content, category } = req.body;
    const { data: entryData, error: entryError } = await supabase.from('entries').insert([
        {
            entry_id: uuidv4(),
            title,
            content,
            category,
            creator_id: req.user.id
        },
    ]).select(entry_keys);
    if (entryError) {
        console.log(entryError);
        return res.status(400).json({ error: entryError.message });
    }
    return res.status(201).json(entryData[0]);
}

export const getEntries = async (req, res) => {
    const { page, perPage } = req.query;
    let query = supabase.from('entries').select(entry_keys).eq('creator_id', req.user.id).is('deleted_at', null).order('created_at', { ascending: false });

    if (req.query.category) {
        let category = req.query.category.toLowerCase();
        query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;
    const paginatedEntries = paginate(data, page, perPage);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(paginatedEntries);
}

export const getEntry = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('entries').select(entry_keys).eq('entry_id', id).eq('creator_id', req.user.id).is('deleted_at', null);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data[0]);
}

export const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const { data, error } = await supabase.from('entries').update({ title, content, category }).eq('entry_id', id).eq('creator_id', req.user.id).is('deleted_at', null).select(entry_keys);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data[0]);
}

export const deleteEntry = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('entries').update({ deleted_at: new Date() }).eq('entry_id', id).eq('creator_id', req.user.id).is('deleted_at', null);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Entry deleted successfully' });
}







