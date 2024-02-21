const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

//logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//admin api
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT name, role FROM admin WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];

        if (user) {
            const { name, role } = user;
            return res.json({ success: true, message: 'Login successful', name, role });
        } else
            return res.status(404).json({ success: false, message: 'User not found' });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.get('/admin/branches', async (req, res) => {
    try {
        const branchRecords = await pool.query('SELECT * FROM branches');
        res.json(branchRecords.rows);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Failed to fetch branches. Please try again later.' });
    }
});
app.post('/admin/addBranch', async (req, res) => {
    const { branch_name, branch_tag, course_tag } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO branches (branch_name, branch_tag, course_tag) VALUES ($1, $2, $3) RETURNING *',
            [branch_name, "T" + branch_tag, course_tag]
        );

        const { rows: [newBranch] } = result;

        res.json({ success: true, message: 'Branch added successfully', newBranch });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.delete('/admin/delBranch/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM branches WHERE branch_tag = $1 RETURNING *',
            [branch_tag]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }

        res.json({ success: true, message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ success: false, error: 'Failed to delete branch. Please try again later.' });
    }
});


app.get('/admin/profs/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const profs = await pool.query('SELECT * FROM profs WHERE branch_tag = $1', [branch_tag]);
        res.json(profs.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/admin/addProf', async (req, res) => {
    const { name, email, role, branch_tag } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO profs (name, email, role, branch_tag) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, role, branch_tag]
        );

        const newProf = result.rows[0];

        res.json({ success: true, message: 'Professor added successfully', newProf });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.put('/admin/updateProf/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const result = await pool.query(
            'UPDATE profs SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
            [name, email, role, id]
        );

        const updatedProf = result.rows[0];

        if (updatedProf) {
            res.json({ success: true, message: 'Professor updated successfully', updatedProf });
        } else {
            res.status(404).json({ success: false, message: 'Professor not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.delete('/admin/deleteProf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM profs WHERE id = $1 RETURNING *', [id]);
        const deletedProf = result.rows[0];

        if (deletedProf) res.json({ success: true, message: 'Professor deleted successfully', deletedProf });
        else res.status(404).json({ success: false, message: 'Professor not found' });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/admin/courses/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const courses = await pool.query(`SELECT course_code, curriculum, th_name, eng_name, credit, course_type FROM courses WHERE branch_tag = $1`, [branch_tag]);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/admin/importCourse', async (req, res) => {
    const { data } = req.body;

    try {
        for (const item of data) {
            await pool.query(
                'INSERT INTO courses (course_code, curriculum, th_name, eng_name, credit, course_type, branch_tag, course_tag, combined_code_curriculum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [item.course_code, parseInt(item.curriculum), item.th_name, item.eng_name, item.credit, item.course_type, item.branch_tag, item.course_tag, `${item.course_code}-${item.curriculum}`]
            );
        }

        res.json({ success: true, message: 'Course data imported successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//profs api
app.post('/profs/login', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT id, name, role, branchtag FROM profs WHERE email = $1', [email]);
        const professor = result.rows[0];

        if (professor) {
            const { id, name, role, branchtag } = professor;
            return res.json({ success: true, message: 'Professor login successful', id, name, email, role, branchtag });
        } else {
            return res.status(404).json({ success: false, message: 'Professor not found' });
        }
    } catch (error) {
        console.error('Error in professor login:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.get('/api/branches', async (req, res) => {
    try {
        const branches = await pool.query('SELECT * FROM branches');
        res.json(branches.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branch tags' });
    }
});

app.get('/api/courses/:branchtag', async (req, res) => {
    const { branchtag } = req.params;

    try {
        const courses = await pool.query('SELECT * FROM courses WHERE branchtag = $1', [branchtag]);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
