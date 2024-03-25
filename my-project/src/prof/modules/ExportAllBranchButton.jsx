import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function ExportAllBranchButton({ exportDataAllBranch }) {
    console.log(exportDataAllBranch)
    const handleClick = async () => {
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([
                ['รหัสวิชา', 'รหัสวิชา-พ.ศ.หลักสูตร', 'ชื่อวิชา', 'หน่วยกิต', 'หน่วย', 'จำนวน ชม.', 'วัน', 'เริ่ม', 'สิ้นสุด', 'ห้อง', 'สาขา', 'อาจารย์']
            ]);

            let rowIndex = 1; // Start from the second row after headers

            // Sort the branch keys in a specific order (e.g., "T12" before "T14")
            const sortedBranchKeys = Object.keys(exportDataAllBranch).sort();
            sortedBranchKeys.forEach(branchKey => {
                XLSX.utils.sheet_add_aoa(ws, [[branchKey]], { origin: rowIndex, skipHeader: true });
                rowIndex++;

                exportDataAllBranch[branchKey].forEach(course => {
                    const { course_code, combined_code_curriculum, eng_name, credit, groups } = course;

                    groups.forEach(group => {
                        const { unit, hours, day_of_week, start_time, end_time, lab_room, profs, branch_years } = group;
                        const row = [course_code, combined_code_curriculum, eng_name, credit, unit, hours, day_of_week, start_time, end_time, lab_room, branch_years, profs];
                        XLSX.utils.sheet_add_aoa(ws, [row], { origin: rowIndex });
                        rowIndex++;
                    });
                });
            });

            const columnWidths = [
                { wch: 12 }, // Course Code
                { wch: 22 }, // Combined Code Curriculum
                { wch: 60 }, // Eng Name
                { wch: 8 },  // Credit
                { wch: 6 },  // Unit
                { wch: 8 },  // Hours
                { wch: 12 }, // Day of Week
                { wch: 12 }, // Start Time
                { wch: 12 }, // End Time
                { wch: 12 }, // Lab Room
                { wch: 60 }, // Branch Year
                { wch: 60 }, // Profs
            ];

            ws['!cols'] = columnWidths;

            XLSX.utils.book_append_sheet(wb, ws, 'All Branch Scheduler');

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'all_branch_scheduler.xlsx');
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
        <button className='rounded-sm shadow-md shadow-gray-700 bg-purple-300 hover:bg-purple-700 text-white font-bold py-2 px-4 ml-2'
            type='button'
            onClick={handleClick}
        >
            Export All Branch Scheduler
        </button>
    );
}