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

//General API
app.get('/api/branches', async (req, res) => {
    try {
        const branchRecords = await pool.query('SELECT * FROM branches');
        res.json(branchRecords.rows);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Failed to fetch branches. Please try again later.' });
    }
});
app.get('/api/profs/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const profs = await pool.query('SELECT * FROM profs WHERE branch_tag = $1', [branch_tag]);
        res.json(profs.rows);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/api/courses/:branch_tag', async (req, res) => {
    const { branch_tag } = req.params;

    try {
        const courses = await pool.query('SELECT * FROM courses WHERE branch_tag = $1', [branch_tag]);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

//Admin API
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT name, role FROM admin WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];

        if (user) {
            const { name, role } = user;
            return res.json({ message: 'Login successful', name, role });
        } else
            return res.status(404).json({ message: 'Incorrect username or password' });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
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

        res.json({ message: 'Branch added successfully', newBranch });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: 'Branch not found' });
        }

        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ error: 'Failed to delete branch. Please try again later.' });
    }
});
app.post('/admin/addProf', async (req, res) => {
    const { name, email, role, branch_tag } = req.body;

    try {
        const existingProf = await pool.query(
            'SELECT * FROM profs WHERE name = $1',
            [name]
        );

        if (existingProf.rows.length > 0) {
            return res.status(400).json({ error: 'Professor with the same name or email already exists' });
        }

        const result = await pool.query(
            'INSERT INTO profs (name, email, role, branch_tag) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, role, branch_tag]
        );

        res.json({ message: 'Professor added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        if (updatedProf) res.json({ message: 'Professor updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/admin/deleteProf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM profs WHERE id = $1 RETURNING *', [id]);
        const deletedProf = result.rows[0];

        if (deletedProf) res.json({ message: 'Professor deleted successfully' });
        else res.status(404).json({ error: 'Professor not found' });

    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json({ message: 'Course data imported successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Profs API
app.post('/profs/login', async (req, res) => {
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
app.post('/profs/addGroups', async (req, res) => {
    const { mergedSections, course_id, group_status } = req.body;

    try {
        for (const groupData of mergedSections) {
            const { group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room, prof_name, branch_year } = groupData;

            const groupResult = await pool.query(
                'INSERT INTO groups (course_id, group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room, group_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
                [course_id, group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room, group_status]
            );

            const groupId = groupResult.rows[0].id;

            // Add data to group_profs table
            for (const prof of prof_name) {
                await pool.query('INSERT INTO group_profs (group_id, prof_name) VALUES ($1, $2)', [groupId, prof]);
            }

            // Add data to group_branches table
            for (const branch of branch_year) {
                const branch_tag = branch.substring(0, 3);
                await pool.query('INSERT INTO group_branch_year (group_id, branch_year, branch_tag) VALUES ($1, $2, $3)', [groupId, branch, branch_tag]);
            }
        }

        res.json({ success: true, message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
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
