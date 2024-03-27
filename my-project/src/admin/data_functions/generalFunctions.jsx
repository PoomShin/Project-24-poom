import Papa from 'papaparse'; // Library for parsing CSV files

export const handleCSVFileLoad = (text, branchTag, courseTag, selectedCurriculum) => {
    const { data } = Papa.parse(text, { header: true }); // Parsing CSV data with headers

    // Check if all required columns exist
    const requiredColumns = ['course_code', 'th_name', 'eng_name', 'credit', 'course_type'];
    const missingColumns = requiredColumns.filter(column => !data[0].hasOwnProperty(column));

    if (missingColumns.length > 0) {
        alert(`Missing columns: ${missingColumns.join(', ')}`)
        throw new Error(`Missing columns: ${missingColumns.join(', ')}`);
    }

    const dataWithTags = data.map(item => ({
        ...item,
        branch_tag: branchTag,
        course_tag: courseTag,
        curriculum: (item.curriculum && item.curriculum.trim() !== '') ? item.curriculum : selectedCurriculum,
    }));

    return dataWithTags;
};

export const generateOptions = () => {
    const options = [];
    for (let i = 0; i < 100; i++) {
        const value = i.toString().padStart(2, '0');
        options.push(
            <option key={i} value={value}>
                {value}
            </option>
        );
    }
    return options;
};