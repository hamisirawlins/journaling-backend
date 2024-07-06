import supabase from '../supabase.js';
import { paginate } from '../utils/pagination.js';
import { v4 as uuidv4 } from 'uuid';

export const createEntry = async (req, res) => {
    const { title, content, category } = req.body;
    const { data, error } = await supabase.from('entries').insert([
        {
            entry_id: uuidv4(),
            title,
            content,
            category,
            creator_id: req.user.id,
        },
    ]);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
}

export const getEntries = async (req, res) => {
    const { page, perPage } = req.query;
    const { data, error } = await supabase.from('entries').select('*').eq('creator_id', req.user.id).is('deleted_at', null);
    const paginatedEntries = paginate(data, page, perPage);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(paginatedEntries);
}

export const getEntry = async (req, res) => {
    const { entry_id } = req.params;
    const { data, error } = await supabase.from('entries').select('*').eq('entry_id', entry_id).eq('creator_id', req.user.id).is('deleted_at', null);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const updateEntry = async (req, res) => { 
    const { entry_id } = req.params;
    const { title, content, category } = req.body;
    const { data, error } = await supabase.from('entries').update({ title, content, category }).eq('entry_id', entry_id).eq('creator_id', req.user.id).is('deleted_at', null);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const deleteEntry = async (req, res) => { 
    const { entry_id } = req.params;
    const { data, error } = await supabase.from('entries').update({ deleted_at: new Date() }).eq('entry_id', entry_id).eq('creator_id', req.user.id).is('deleted_at', null);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const getSummaries = async (req, res) => {
}




