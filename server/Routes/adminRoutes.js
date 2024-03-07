const { router, pool } = require('./commonImport');

router.post('/addBranch', async (req, res) => {
    const { branch_name, branch_tag, course_tag } = req.body;

    try {
        const existingBranch = await pool.query('SELECT * FROM branches WHERE branch_tag = $1 OR course_tag = $2', [branch_tag, course_tag]);

        if (existingBranch.rows.length > 0) {
            return res.status(400).json({ error: 'Branch tag or course tag already exists' });
        }

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
router.delete('/delBranch/:branch_tag', async (req, res) => {
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
router.post('/addProf', async (req, res) => {
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
router.put('/updateProf/:id', async (req, res) => {
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
router.delete('/deleteProf/:id', async (req, res) => {
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
router.post('/importCourse', async (req, res) => {
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
router.put('/updateCourse/:id', async (req, res) => {
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
router.delete('/delCourse/:id', async (req, res) => {
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

module.exports = router;