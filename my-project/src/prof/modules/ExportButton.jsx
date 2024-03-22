import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function ExportButton({ currentBranch, exportDataByBranch }) {
    const handleClick = async () => {
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([
                ['Course Code', 'Combined Code Curriculum', 'Eng Name', 'Credit', 'Unit', 'Hours', 'Day of Week', 'Start Time', 'End Time', 'Lab Room', 'Branch Year', 'Profs']
            ]);

            exportDataByBranch.forEach(course => {
                const { course_code, combined_code_curriculum, eng_name, credit, groups } = course;
                groups.forEach(({ unit, hours, day_of_week, start_time, end_time, lab_room, profs, branch_year }) => {
                    const row = [course_code, combined_code_curriculum, eng_name, credit, unit, hours, day_of_week, start_time, end_time, lab_room, branch_year, profs];
                    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
                });
            });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `scheduler-${currentBranch}.xlsx`);
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    return (
        <button
            className='rounded-sm shadow-md shadow-gray-700 bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2'
            type='button'
            onClick={handleClick}
        >
            Export My Branch
        </button>
    );
}