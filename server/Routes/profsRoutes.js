const { router, pool } = require('./commonImport');

router.post('/addGroups', async (req, res) => {
    const { mergedGroups, course_id, group_status, owner_branch_tag } = req.body;

    try {
        const groupInsertPromises = [];

        for (const groupData of mergedGroups) {
            const { group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room, prof_name, branch_year } = groupData;

            const groupResult = pool.query(
                'INSERT INTO groups (course_id, group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room, group_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
                [course_id, group_num, quantity, unit, hours, day_of_week, start_time, end_time, lab_room.toLowerCase(), group_status]
            );

            const groupId = (await groupResult).rows[0].id;

            const profInsertPromises = prof_name.map(async (name) => {
                const profQuery = 'SELECT id FROM profs WHERE name = $1';
                const profResult = await pool.query(profQuery, [name]);
                const profId = profResult.rows[0].id;
                await pool.query('INSERT INTO group_profs (group_id, prof_id) VALUES ($1, $2)', [groupId, profId]);
            });

            const branchInsertPromises = branch_year.map(async (branch) => {
                await pool.query('INSERT INTO group_branch_year (group_id, branch_year, owner_branch_tag) VALUES ($1, $2, $3)', [groupId, branch, owner_branch_tag]);
            });

            groupInsertPromises.push(...profInsertPromises, ...branchInsertPromises);
        }

        await Promise.all(groupInsertPromises);

        res.json({ success: true, message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/myCourse/:name', async (req, res) => {
    try {
        const { name } = req.params;

        const courseQuery = `
            SELECT DISTINCT c.id, c.combined_code_curriculum, c.course_type
            FROM courses c
            JOIN groups g ON c.id = g.course_id
            JOIN group_profs gp ON g.id = gp.group_id
            WHERE gp.prof_id IN (
                SELECT id FROM profs WHERE name = $1
            )
        `;

        const { rows: courseRows } = await pool.query(courseQuery, [name]);

        const groupQuery = `
            SELECT g.*, ARRAY_AGG(gy.branch_year) AS branch_years
            FROM groups g
            JOIN group_branch_year gy ON g.id = gy.group_id
            JOIN group_profs gp ON g.id = gp.group_id
            WHERE gp.prof_id IN (
                SELECT id FROM profs WHERE name = $1
            )
            GROUP BY g.id
        `;

        const { rows: groupRows } = await pool.query(groupQuery, [name]);

        const groupsByCourse = {};
        groupRows.forEach(group => {
            if (!groupsByCourse[group.course_id]) {
                groupsByCourse[group.course_id] = [];
            }
            groupsByCourse[group.course_id].push(group);
        });

        const result = courseRows.map(courseRow => ({
            ...courseRow,
            groups: groupsByCourse[courseRow.id] || []
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

        // Fetch all groups and branch_years for each course along with professors
        const courseDataPromises = courseIds.map(async courseId => {
            const groupQuery = `
                SELECT g.*, ARRAY_AGG(gy.branch_year) AS branch_years, ARRAY_AGG(p.name) AS professors
                FROM groups g
                JOIN group_branch_year gy ON g.id = gy.group_id
                JOIN group_profs gp ON g.id = gp.group_id
                JOIN profs p ON gp.prof_id = p.id
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
                ARRAY_AGG(p.name) AS prof_names,
                ARRAY_AGG(gy.branch_year) AS branch_years
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.Id = gy.group_id
            JOIN 
                group_profs gp ON g.Id = gp.group_id
            JOIN 
                profs p ON gp.prof_id = p.id
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
                ARRAY_AGG(p.name) AS prof_names
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.Id = gy.group_id
            JOIN 
                group_profs gp ON g.Id = gp.group_id
            JOIN 
                profs p ON gp.prof_id = p.id
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

router.get('/allGroups/:branch', async (req, res) => {
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
                gy.owner_branch_tag,
                ARRAY_AGG(p.name) AS prof_names
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.Id = gy.group_id
            JOIN 
                group_profs gp ON g.Id = gp.group_id
            JOIN 
                profs p ON gp.prof_id = p.id
            JOIN 
                courses c ON g.course_id = c.Id
            WHERE 
                gy.owner_branch_tag = $1
            GROUP BY 
                g.Id, c.eng_name, c.combined_code_curriculum, c.course_type, gy.owner_branch_tag;
        `;

        const { rows } = await pool.query(query, [branch]);

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

router.get('/groupsStatus/:branch', async (req, res) => {
    try {
        const { branch } = req.params;

        const query = `
            SELECT 
                g.id as group_id,
                g.day_of_week,
                g.start_time,
                g.end_time,
                g.group_status,
                gy.branch_year,
                gy.owner_branch_tag,
                ARRAY_AGG(p.name) as profs
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.id = gy.group_id
            LEFT JOIN 
                group_profs gp ON g.id = gp.group_id
            LEFT JOIN 
                profs p ON gp.prof_id = p.id
            WHERE
                LEFT(gy.branch_year, 3) = $1
            GROUP BY
                g.id, g.day_of_week, g.start_time, g.end_time, g.group_status, gy.branch_year, gy.owner_branch_tag;
        `;

        const { rows } = await pool.query(query, [branch]);

        res.json(rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

router.get('/labRoom/:branch', async (req, res) => {
    try {
        const { branch } = req.params;

        const query = `
            SELECT 
                DISTINCT lab_room
            FROM 
                groups g
            JOIN 
                group_branch_year gy ON g.id = gy.group_id
            WHERE 
                gy.owner_branch_tag = $1
                AND lab_room <> ''
        `;

        const { rows } = await pool.query(query, [branch]);

        res.json(rows.map(row => row.lab_room));
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
})

router.delete('/delCourse/:courseId/:profName', async (req, res) => {
    try {
        const { courseId, profName } = req.params;

        // Delete all groups with the specified course_id and where the provided profName exists in group_profs
        const query = `
            DELETE FROM groups 
            WHERE course_id = $1 
            AND Id IN (
                SELECT gp.group_id 
                FROM group_profs gp
                JOIN profs p ON gp.prof_id = p.id
                WHERE gp.group_id = groups.Id
                AND p.name = $2
            )
        `;
        await pool.query(query, [courseId, profName]);

        res.json({ success: true, message: `All groups with the specified course_id and professor's name '${profName}' have been deleted` });
    } catch (error) {
        console.error('Error deleting groups:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.delete('/delGroup/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;

        // Delete the group with the specified ID
        const query = 'DELETE FROM groups WHERE id = $1';
        await pool.query(query, [groupId]);

        res.json({ success: true, message: `Group with ID ${groupId} has been deleted successfully` });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.put('/updateGroup/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupData } = req.body;

        const {
            group_num,
            quantity,
            day_of_week,
            start_time,
            end_time,
            lab_room
        } = groupData;

        // Update the specified fields of the group
        const query = `
            UPDATE groups
            SET 
                group_num = $1,
                quantity = $2,
                day_of_week = $3,
                start_time = $4,
                end_time = $5,
                lab_room = $6,
                group_status = 'waiting'
            WHERE
                id = $7
        `;

        await pool.query(query, [
            group_num,
            quantity,
            day_of_week,
            start_time,
            end_time,
            lab_room.toLowerCase(),
            groupId
        ]);

        res.json({ success: true, message: `Group with ID ${groupId} has been updated successfully` });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.put('/updateGroupStatus/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupStatus } = req.body;

        const query = `
            UPDATE groups
            SET 
                group_status = $1
            WHERE
                id = $2
        `;

        await pool.query(query, [groupStatus, groupId]);

        res.json({ success: true, message: `Group status with ID ${groupId} has been updated successfully` });
    } catch (error) {
        console.error('Error updating group status:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/exportMyBranch/:branch', async (req, res) => {
    try {
        const { branch } = req.params;

        const query = `
            SELECT 
                c.course_code , 
                c.combined_code_curriculum, 
                c.eng_name, 
                c.credit, 
                g.unit, 
                g.hours, 
                g.day_of_week, 
                g.start_time, 
                g.end_time, 
                g.lab_room, 
                g.group_status,
                ARRAY_AGG(DISTINCT gy.branch_year) AS branch_years,
                ARRAY_AGG(DISTINCT p.name) AS profs
            FROM 
                groups g
            JOIN 
                courses c ON g.course_id = c.id
            LEFT JOIN 
                group_profs gp ON g.id = gp.group_id
            LEFT JOIN 
                profs p ON gp.prof_id = p.id
            LEFT JOIN 
                group_branch_year gy ON g.id = gy.group_id
            WHERE 
                gy.owner_branch_tag = $1
            GROUP BY 
                c.course_code, 
                c.combined_code_curriculum, 
                c.eng_name, 
                c.credit,
                g.unit, 
                g.hours, 
                g.day_of_week, 
                g.start_time, 
                g.end_time, 
                g.lab_room,
                g.group_status;
        `;

        const { rows } = await pool.query(query, [branch]);

        // Organize the data by grouping groups belonging to the same course
        const courses = {};
        rows.forEach(row => {
            const courseKey = `${row.course_code}-${row.combined_code_curriculum}-${row.eng_name}`;
            if (!courses[courseKey]) {
                courses[courseKey] = [];
            }
            courses[courseKey].push(row);
        });

        // Format the data
        const formattedData = Object.keys(courses).map(courseKey => {
            const courseGroups = courses[courseKey].map(group => ({
                unit: group.unit,
                hours: group.hours,
                day_of_week: group.day_of_week,
                start_time: group.start_time,
                end_time: group.end_time,
                lab_room: group.lab_room,
                profs: group.profs.join(', '),
                branch_years: group.branch_years.join(', '),
                group_status: group.group_status
            }));

            return {
                course_code: courses[courseKey][0].course_code,
                combined_code_curriculum: courses[courseKey][0].combined_code_curriculum,
                eng_name: courses[courseKey][0].eng_name,
                credit: courses[courseKey][0].credit,
                groups: courseGroups
            };
        });

        res.json(formattedData);
    } catch (err) {
        console.error('Error exporting branch data:', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

router.get('/exportAllBranch', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.course_code , 
                c.combined_code_curriculum, 
                c.eng_name, 
                c.credit, 
                gy.owner_branch_tag, -- Use owner_branch_tag instead of branch_tag
                g.unit, 
                g.hours, 
                g.day_of_week, 
                g.start_time, 
                g.end_time, 
                g.lab_room, 
                g.group_status,
                ARRAY_AGG(DISTINCT gy.branch_year) AS branch_years,
                ARRAY_AGG(DISTINCT p.name) AS profs
            FROM 
                groups g
            JOIN 
                courses c ON g.course_id = c.id
            LEFT JOIN 
                group_profs gp ON g.id = gp.group_id
            LEFT JOIN 
                profs p ON gp.prof_id = p.id
            LEFT JOIN 
                group_branch_year gy ON g.id = gy.group_id
            GROUP BY 
                c.course_code, 
                c.combined_code_curriculum, 
                c.eng_name, 
                c.credit,
                gy.owner_branch_tag, -- Group by owner_branch_tag
                g.unit, 
                g.hours, 
                g.day_of_week, 
                g.start_time, 
                g.end_time, 
                g.lab_room,
                g.group_status;
        `;

        const { rows } = await pool.query(query);

        // Organize the data by grouping branches, courses, and groups
        const formattedData = {};
        rows.forEach(row => {
            const branchTag = row.owner_branch_tag;
            const courseKey = `${row.combined_code_curriculum}`;
            if (!formattedData[branchTag]) {
                formattedData[branchTag] = {};
            }
            if (!formattedData[branchTag][courseKey]) {
                formattedData[branchTag][courseKey] = {
                    course_code: row.course_code,
                    combined_code_curriculum: row.combined_code_curriculum,
                    eng_name: row.eng_name,
                    credit: row.credit,
                    groups: []
                };
            }
            formattedData[branchTag][courseKey].groups.push({
                unit: row.unit,
                hours: row.hours,
                day_of_week: row.day_of_week,
                start_time: row.start_time,
                end_time: row.end_time,
                lab_room: row.lab_room,
                profs: row.profs.join(', '),
                branch_years: row.branch_years.join(', '),
                group_status: row.group_status
            });
        });

        res.json(formattedData);
    } catch (err) {
        console.error('Error exporting branch data:', err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

module.exports = router;