export default function TableRow({ courseCode, defaultCurriculum, thName, engName, credits, courseType, onTransfer, rowData, options }) {
    const [selectedCurriculum, setSelectedCurriculum] = useState(defaultCurriculum);
    useEffect(() => {
        setSelectedCurriculum(selectedCurriculum);
    }, [selectedCurriculum]);

    const handleCurriculumChange = (e) => {
        setSelectedCurriculum(e.target.value);
    };

    const handleTransfer = () => {
        onTransfer({
            ...rowData,
        });
    };

    return (
        <tr>
            <td className="py-2 w-28">{courseCode}</td>
            <td className="py-2 w-10">
                {selectedCurriculum !== '' && (
                    <select className="border border-gray-300 rounded-md px-2 py-1 mt-1 focus:outline-none focus:border-blue-500"
                        value={selectedCurriculum}
                        onChange={handleCurriculumChange}
                    >
                        {options}
                    </select>
                )}
            </td>
            <td className="px-4 py-2">{thName}</td>
            <td className="px-4 py-2">{engName}</td>
            <td className="py-2 w-20">{credits}</td>
            <td className="py-2 w-28">{courseType}</td>
            <td className="py-2 w-16">
                <button className="bg-red-500 hover:bg-red-600 px-2 py-1 text-white rounded" onClick={handleTransfer}>
                    Transfer
                </button>
            </td>
        </tr>
    );
}

import { useState, useEffect } from 'react';
