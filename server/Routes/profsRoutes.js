const { router, pool } = require('./commonImport');

router.post('/addGroups', async (req, res) => {
    const { mergedGroups, course_id, group_status, owner_branch_tag } = req.body;

    try {
        for (const groupData of mergedGroups) {
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

router.get('/myCourse/:name', async (req, res) => {
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

router.get('/allCourse', async (req, res) => {
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

router.get('/groupsB/:branch', async (req, res) => {
    try {
        const { branch } = req.params;
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
                c.eng_name,
                c.combined_code_curriculum,
                c.course_type,
                ARRAY_AGG(gp.prof_name) AS prof_names,
                ARRAY_AGG(gy.branch_year) AS branch_years
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.Id = gy.group_id
            JOIN 
                group_profs gp ON g.Id = gp.group_id
            JOIN 
                courses c ON g.course_id = c.Id
            WHERE
                gy.owner_branch_tag = $1
            GROUP BY 
                g.Id, c.eng_name, c.combined_code_curriculum, c.course_type;
        `;

        const { rows } = await pool.query(query, [branch]);

        // Check if rows exist, if not, send an empty array as the response
        if (rows.length === 0) {
            res.json([]); // Send an empty array as response
        } else {
            res.json(rows);
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred while fetching groups' });
    }
});

router.get('/groupsBY/:branchYear', async (req, res) => {
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
                c.eng_name,
                c.combined_code_curriculum,
                c.course_type,
                gy.owner_branch_tag,
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
                g.Id, c.eng_name, c.combined_code_curriculum, c.course_type, gy.owner_branch_tag;
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

module.exports = router;
