import supabase from "../supabase.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        data: { username },
    });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const updatePassword = async (req, res) => {
    const user = req.user;
    const { data, error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const updateUserName = async (req, res) => {
    const user= req.user;
    const { data, error } = await supabase.auth.updateUser(user.id, { username: req.body.username });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
}

export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
}