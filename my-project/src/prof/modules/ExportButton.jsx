import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function ExportButton({ currentBranch, exportDataByBranch }) {
    const handleClick = async () => {
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([
                ['รหัสวิชา', 'รหัสวิชา-พ.ศ.หลักสูตร', 'ชื่อวิชา', 'หน่วยกิต', 'หน่วย', 'จำนวน ชม.', 'วัน', 'เริ่ม', 'สิ้นสุด', 'ห้อง', 'สาขา', 'อาจารย์']
            ]);

            exportDataByBranch.forEach(course => {
                const { course_code, combined_code_curriculum, eng_name, credit, groups } = course;

                groups.sort((a, b) => {
                    if (a.lab_room !== '' && b.lab_room === '') {
                        return 1;
                    } else if (a.lab_room === '' && b.lab_room !== '') {
                        return -1;
                    } else {
                        const daysOfWeekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        return daysOfWeekOrder.indexOf(a.day_of_week) - daysOfWeekOrder.indexOf(b.day_of_week) || a.start_time.localeCompare(b.start_time);
                    }
                });

                groups.forEach(({ unit, hours, day_of_week, start_time, end_time, lab_room, profs, branch_years }) => {
                    const row = [course_code, combined_code_curriculum, eng_name, credit, unit, hours, day_of_week, start_time, end_time, lab_room, branch_years, profs];
                    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
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

            XLSX.utils.book_append_sheet(wb, ws, `scheduler-${currentBranch}`);

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
            Export {currentBranch} Scheduler
        </button>
    );
}