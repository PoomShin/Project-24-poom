import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddGroup from '../components/AddGroup';
import GroupItem from '../components/GroupItem';
import { useCoursesContext, useAddGroupMutation } from '../../context/Prof-Context';

export default function InsertCourseModal({ isVisible, onClose }) {
    const { courses } = useCoursesContext();
    const addGroupMutation = useAddGroupMutation();

    const [lectureSection, setLectureSection] = useState([]);
    const [labSection, setLabSection] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState('');
    const [courseInfo, setCourseInfo] = useState({
        id: null,
        th_name: '',
        eng_name: '',
        credit: '',
        course_type: ''
    });

    useEffect(() => {
        if (selectedCourse) {
            const selectedCourseData = courses.find(course => course.combined_code_curriculum === selectedCourse);
            if (selectedCourseData) {
                setCourseInfo({
                    id: selectedCourseData.id,
                    th_name: selectedCourseData.th_name,
                    eng_name: selectedCourseData.eng_name,
                    credit: selectedCourseData.credit,
                    course_type: selectedCourseData.course_type
                });
            }
        } else {
            setCourseInfo({
                id: null,
                th_name: '',
                eng_name: '',
                credit: '',
                course_type: ''
            });
        }
    }, [selectedCourse, courses]);

    const handleCourseChange = e => {
        setSelectedCourse(e.target.value);
    };

    const handleAddLectureSection = curSection => {
        setLectureSection([...lectureSection, curSection]);
    };

    const handleAddLabSection = curSection => {
        setLabSection([...labSection, curSection]);
    };

    const handleSubmit = async () => {
        try {
            const mergedSections = [...lectureSection, ...labSection];
            const groupData = {
                mergedSections,
                course_id: courseInfo.id
            };
            console.log(groupData)
            await addGroupMutation.mutateAsync(groupData);
            console.log('Group added successfully');
            onClose();
        } catch (error) {
            console.error('Error adding group:', error);
            // Handle error if needed
        }
    };

    return isVisible ? (
        <PortalContainer>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4'>
                <div className='flex'>

                    <select
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        className="appearance-none border border-gray-400 p-1 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select a course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course.combined_code_curriculum}>
                                {course.combined_code_curriculum}
                            </option>
                        ))}
                    </select>

                    <InputField placeholder='thname' width={72} value={courseInfo.th_name} readOnly />
                    <InputField placeholder='engname' width={72} value={courseInfo.eng_name} readOnly />
                </div>
                <div className='flex my-4'>
                    <InputField placeholder='credit' width={20} value={courseInfo.credit} readOnly />
                    <InputField placeholder='course type' width={24} value={courseInfo.course_type} readOnly />
                </div>

            </div>

            {/* add groups*/}
            <div className='flex flex-col w-10/12 overflow-scroll'>
                <span className='text-3xl text-white mb-2'>Lecture</span>
                <SectionList sections={lectureSection} onAddSection={handleAddLectureSection} />

                <span className='text-3xl text-white mt-8 mb-2'>Laboratory</span>
                <SectionList sections={labSection} onAddSection={handleAddLabSection} isLab />
            </div>
            {/* button */}
            <div className='absolute bottom-0 right-0 flex mb-4 mr-8'>
                <button className='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4' type='button' onClick={handleSubmit}>
                    Submit
                </button>
                <button className='rounded bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4' type='button' onClick={onClose}>
                    Close
                </button>
            </div>
        </PortalContainer>
    ) : null;
}

const PortalContainer = ({ children }) => {
    return createPortal(
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50'>
            {children}
        </div>,
        document.getElementById('root-modal')
    );
};

const InputField = ({ width, ...props }) => {
    return <input className={`w-${width} rounded-lg bg-blue-100 mx-2 p-1`} {...props} />;
}

const SectionList = ({ sections, onAddSection, isLab }) => {
    return (
        <div className={`h-64 flex overflow-x-auto ${isLab ? 'bg-orange-100' : 'bg-green-100'} p-4`}>
            {sections.map((sec, index) => (
                <GroupItem key={index} {...sec} isLab={isLab} />
            ))}
            <AddGroup onAddSection={onAddSection} isLab={isLab} />
        </div>
    );
}