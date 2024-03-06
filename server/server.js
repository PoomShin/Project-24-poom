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
    const duplicateCourses = [];

    try {
        for (const item of data) {
            const existingCourse = await pool.query('SELECT * FROM courses WHERE combined_code_curriculum = $1', [`${item.course_code}-${item.curriculum}`]);

            if (existingCourse.rows.length > 0) {
                duplicateCourses.push(existingCourse.rows[0]);
            } else {
                await pool.query(
                    'INSERT INTO courses (course_code, curriculum, th_name, eng_name, credit, course_type, branch_tag, course_tag, combined_code_curriculum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                    [item.course_code, parseInt(item.curriculum), item.th_name, item.eng_name, item.credit, item.course_type, item.branch_tag, item.course_tag, `${item.course_code}-${item.curriculum}`]
                );
            }
        }

        if (duplicateCourses.length > 0) {
            res.status(400).json({ error: `There are ${duplicateCourses.length} duplicate courses in your data`, duplicates: duplicateCourses });
        } else {
            res.json({ message: 'Course data imported successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/admin/updateCourse/:id', async (req, res) => {
    const courseId = req.params.id;
    const { course_code, curriculum, th_name, eng_name, credit, course_type } = req.body;

    // Concatenate course_code and curriculum to form combined_code_curriculum
    const combined_code_curriculum = `${course_code}-${curriculum}`;

    try {
        // Check if the combined_code_curriculum already exists for another course
        const duplicateCheck = await pool.query(
            'SELECT id FROM courses WHERE combined_code_curriculum = $1 AND id != $2',
            [combined_code_curriculum, courseId]
        );

        if (duplicateCheck.rows.length > 0) {
            // If a duplicate is found, return an error
            return res.status(400).json({ error: 'Duplicate course detected' });
        }

        // Update the course if no duplicate is found
        const result = await pool.query(
            'UPDATE courses SET course_code = $1, curriculum = $2, th_name = $3, eng_name = $4, credit = $5, course_type = $6, combined_code_curriculum = $7 WHERE id = $8 RETURNING *',
            [course_code, curriculum, th_name, eng_name, credit, course_type, combined_code_curriculum, courseId]
        );

        const updatedCourse = result.rows[0];

        if (updatedCourse) {
            res.json({ message: 'Course updated successfully' });
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Failed to update course. Please try again later.' });
    }
});

app.delete('/admin/delCourse/:id', async (req, res) => {
    const courseId = req.params.id;

    try {
        // Execute the SQL query to delete the course with the specific ID
        const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [courseId]);

        // Check if any row was affected
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Return success message
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course. Please try again later.' });
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
    const { mergedSections, course_id, group_status, owner_branch_tag } = req.body;

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
                await pool.query('INSERT INTO group_branch_year (group_id, branch_year, owner_branch_tag) VALUES ($1, $2, $3)', [groupId, branch, owner_branch_tag]);
            }
        }

        res.json({ success: true, message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
app.get('/profs/myCourse/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // Fetch unique courses for the professor
        const courseQuery = `
            SELECT DISTINCT c.id, c.combined_code_curriculum, c.course_type
            FROM courses c
            JOIN groups g ON c.id = g.course_id
            JOIN group_profs gp ON g.id = gp.group_id
            WHERE gp.prof_name = $1
        `;

        const { rows: courseRows } = await pool.query(courseQuery, [name]);

        // Extract course IDs
        const courseIds = courseRows.map(row => row.id);

        // Fetch all groups and branch_years for each course
        const courseDataPromises = courseIds.map(async courseId => {
            const groupQuery = `
                SELECT g.*, ARRAY_AGG(gy.branch_year) AS branch_years
                FROM groups g
                JOIN group_branch_year gy ON g.id = gy.group_id
                WHERE g.course_id = $1
                GROUP BY g.id
            `;
            const { rows: groupRows } = await pool.query(groupQuery, [courseId]);
            return groupRows;
        });

        // Wait for all course data queries to finish
        const courseData = await Promise.all(courseDataPromises);

        // Combine the course data with branch_years
        const result = courseRows.map((courseRow, index) => ({
            ...courseRow,
            groups: courseData[index]
        }));

        res.json(result);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});
app.get('/profs/allCourse', async (req, res) => {
    try {
        // Fetch unique courses for all professors
        const courseQuery = `
            SELECT DISTINCT c.id, c.combined_code_curriculum, c.course_type
            FROM courses c
            JOIN groups g ON c.id = g.course_id
            JOIN group_profs gp ON g.id = gp.group_id
        `;

        const { rows: courseRows } = await pool.query(courseQuery);

        // Extract course IDs
        const courseIds = courseRows.map(row => row.id);

        // Fetch all groups and branch_years for each course
        const courseDataPromises = courseIds.map(async courseId => {
            const groupQuery = `
                SELECT g.*, ARRAY_AGG(gy.branch_year) AS branch_years
                FROM groups g
                JOIN group_branch_year gy ON g.id = gy.group_id
                WHERE g.course_id = $1
                GROUP BY g.id
            `;
            const { rows: groupRows } = await pool.query(groupQuery, [courseId]);
            return groupRows;
        });

        // Wait for all course data queries to finish
        const courseData = await Promise.all(courseDataPromises);

        // Combine the course data with branch_years
        const result = courseRows.map((courseRow, index) => ({
            ...courseRow,
            groups: courseData[index]
        }));

        res.json(result);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});
app.get('/profs/groups/:branchYear', async (req, res) => {
    try {
        const { branchYear } = req.params;
        const decodedBranchYear = decodeURIComponent(branchYear);

        const query = `
            SELECT 
                g.Id AS group_id, 
                g.group_num, 
                g.quantity, 
                g.unit, 
                g.hours, 
                g.day_of_week, 
                g.start_time, 
                g.end_time, 
                g.lab_room, 
                g.group_status, 
                c.combined_code_curriculum,
                c.course_type,
                ARRAY_AGG(gp.prof_name) AS prof_names
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.Id = gy.group_id
            JOIN 
                group_profs gp ON g.Id = gp.group_id
            JOIN 
                courses c ON g.course_id = c.Id
            WHERE 
                gy.branch_year = $1
            GROUP BY 
                g.Id, c.combined_code_curriculum, c.course_type;
        `;

        const { rows } = await pool.query(query, [decodedBranchYear]);

        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'No data found' });
        } else {
            res.json(rows);
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
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
