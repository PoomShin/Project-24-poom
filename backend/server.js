const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.get('/admin/branches', async (req, res) => {
    try {
        const branches = await pool.query('SELECT * FROM branches');
        res.json(branches.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});
app.get('/admin/professors/:branchtag', async (req, res) => {
    const { branchtag } = req.params;

    try {
        const professors = await pool.query('SELECT * FROM profs WHERE branchtag = $1', [branchtag]);
        res.json(professors.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/admin/courses/:branchtag', async (req, res) => {
    const { branchtag } = req.params;

    try {
        const courses = await pool.query(`SELECT coursecode, curriculum, thname, engname, credit, coursetype FROM courses WHERE branchtag = $1`, [branchtag]);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM admin WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];

        if (user) {
            const { name, role } = user;
            return res.json({ success: true, message: 'Login successful', name, role });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
app.post('/admin/addBranch', async (req, res) => {
    const { branchname, branchtag, coursetag } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO branches (branchname, branchtag, coursetag) VALUES ($1, $2, $3) RETURNING *',
            [branchname, "T" + branchtag, coursetag]
        );

        const { rows: [newBranch] } = result;

        res.json({ success: true, message: 'Branch added successfully', newBranch });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/admin/addProf', async (req, res) => {
    const { name, email, role, branchtag } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO profs (name, email, role, branchtag) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, role, branchtag]
        );

        const newProf = result.rows[0];

        res.json({ success: true, message: 'Professor added successfully', newProf });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/admin/importCourse', async (req, res) => {
    const { data } = req.body;

    try {
        // Loop through the array of data and insert each item into the database
        for (const item of data) {
            await pool.query(
                'INSERT INTO courses (coursecode, curriculum, thname, engname, credit, coursetype, branchtag, coursetag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [item.coursecode, parseInt(item.curriculum), item.thname, item.engname, item.credit, item.coursetype, item.branchtag, item.coursetag]
            );
        }

        res.json({ success: true, message: 'Course data imported successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
