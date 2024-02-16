export default function AddCourseModal({ courseTag, branchTag, isVisible, onClose }) {
    const [selectedCurriculum, setSelectedCurriculum] = useState('65');
    const [importedData, setImportedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const options = generateOptions();
    const mutation = useImportCoursesMutation();

    const handleCurriculumChange = (e) => setSelectedCurriculum(e.target.value);

    const handleImport = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = handleFileLoad;
        reader.readAsText(file);
    };

    const handleFileLoad = (e) => {
        const text = e.target.result;
        const result = Papa.parse(text, { header: true }); // Parsing CSV data with headers

        const dataWithTags = result.data.map(item => ({
            ...item,
            branchtag: branchTag,
            coursetag: courseTag,
            curriculum: selectedCurriculum
        }));

        setImportedData(dataWithTags);
    };

    const filterDataByCourseTag = () => {
        const filtered = importedData.filter(row => row.coursecode.startsWith(courseTag));
        setFilteredData(filtered);

        const remainingData = importedData.filter(row => !row.coursecode.startsWith(courseTag));
        setImportedData(remainingData);
    };

    const handleTransfer = (rowData) => {
        setFilteredData(prevFilteredData => [...prevFilteredData, rowData]);
        setImportedData(prevImportedData => prevImportedData.filter(item => item === rowData));
    };

    const handleImportDatabase = () => mutation.mutate(filteredData);

    return isVisible && createPortal(
        <div className="w-screen h-screen fixed flex bg-gray-800 bg-opacity-50 z-[999999999999999999999999999999]">
            <AddCourseSideBar
                options={options}
                courseTag={courseTag}
                selectedCurriculum={selectedCurriculum}
                handleCurriculumChange={handleCurriculumChange}
                handleImport={handleImport}
                onClose={onClose}
            />
            <div className="w-full flex flex-col rounded-lg bg-slate-400">
                <Table bg={'bg-orange-200'} text='Validation table'>
                    <tbody className="divide-y bg-white divide-gray-200">
                        {importedData.map((rowData, index) => (
                            <TableRow
                                key={index}
                                courseCode={rowData.coursecode}
                                defaultCurriculum={selectedCurriculum}
                                thName={rowData.thname}
                                engName={rowData.engname}
                                credits={rowData.credit}
                                courseType={rowData.coursetype}
                                rowData={rowData}
                                onTransfer={handleTransfer}
                                options={options}
                            />
                        ))}
                    </tbody>
                </Table>

                <TableValidation filterDataByCourseTag={filterDataByCourseTag} />

                <Table bg='bg-emerald-200' text='Import table'>
                    <tbody className="divide-y bg-white divide-gray-200">
                        {filteredData.map((rowData, index) => (
                            <TableRow
                                key={rowData.id}
                                id={rowData.id}
                                courseCode={rowData.coursecode}
                                defaultCurriculum={rowData.curriculum}
                                thName={rowData.thname}
                                engName={rowData.engname}
                                credits={rowData.credit}
                                courseType={rowData.coursetype}
                                rowData={rowData}
                                onTransfer={handleTransfer}
                                options={options}
                            />
                        ))}
                    </tbody>
                </Table>

                <TableImportButton handleImportDatabase={handleImportDatabase} />
            </div>
        </div>,
        document.getElementById('root-modal')
    );
}

const generateOptions = () => {
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

const useImportCoursesMutation = () => {
    return useMutation(async (data) => axios.post('/admin/importCourse', { data }), {
        onSuccess: () => {
            alert('Data imported successfully');
        },
        onError: (error) => {
            alert('Error importing data: ' + error.message);
        }
    });
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import Papa from 'papaparse'; // Library for parsing CSV files

import Table from '../components/Table';
import TableRow from '../components/TableRow';
import TableValidation from '../components/TableValidation';
import TableImportButton from '../components/TableImportButton';
import AddCourseSideBar from '../components/AddCourseSideBar';