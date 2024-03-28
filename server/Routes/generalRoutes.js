const { router, pool } = require('./commonImport');

router.get('/branches', async (req, res) => {
    try {
        const branchRecords = await pool.query('SELECT * FROM branches ORDER BY branch_tag');
        res.json(branchRecords.rows);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Failed to fetch branches. Please try again later.' });
    }
});

router.get('/profs/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const profs = await pool.query('SELECT * FROM profs WHERE branch_tag = $1', [branch_tag]);
        res.json(profs.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/courses/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const courses = await pool.query('SELECT * FROM courses WHERE branch_tag = $1', [branch_tag]);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

module.exports = router;