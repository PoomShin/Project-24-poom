const { router, pool } = require('./commonImport');

router.post('/admin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT name, role FROM admin WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];

        if (user) {
            const { name, role } = user;
            return res.json({ message: 'Login successful', name, role });
        } else {
            return res.status(404).json({ message: 'Incorrect username or password' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.post('/profs', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT id, name, role, branch_tag FROM profs WHERE email = $1', [email]);
        const professor = result.rows[0];

        if (professor) {
            const { id, name, role, branch_tag } = professor;
            return res.json({ message: 'Professor login successful', id, name, email, role, branch_tag });
        } else {
            return res.status(404).json({ message: 'Professor not found' });
        }
    } catch (error) {
        console.error('Error in professor login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
