import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCoursesContext } from '../../context/Prof-Context';
import { useAddGroupMutation } from '../../api/Profs_API';
import InputSection from '../components/InputSelect';
import ButtonCom from '../components/ButtonCom';
import GroupList from './GroupList';

const parseCredits = credits => {
    const matches = credits.match(/(\d+)\((\d+)-(\d+)-(\d+)\)|(\d+)/);
    if (matches) {
        const [, totalHours, lectureHours, labHours, selfStudyHours, singleCredit] = matches;
        if (lectureHours && labHours && selfStudyHours) {
            return { lectureHours: parseInt(lectureHours), labHours: parseInt(labHours), selfStudyHours: parseInt(selfStudyHours) };
        } else if (totalHours) {
            return { lectureHours: parseInt(totalHours), labHours: 0, selfStudyHours: 0 };
        } else if (singleCredit) {
            return { lectureHours: parseInt(singleCredit), labHours: 0, selfStudyHours: 0 };
        }
    }
    return { lectureHours: 0, labHours: 0, selfStudyHours: 0 };
};

export default function InsertCourseModal({ ownerBranchTag, isVisible, onClose }) {
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

    const [creditHours, setCreditHours] = useState({ lectureHours: 0, labHours: 0, selfStudyHours: 0 });

    const handleCourseChange = e => {
        setSelectedCourse(e.target.value);
    };

    const handleAddLectureSection = curSection => {
        setLectureSection([...lectureSection, curSection]);
    };

    const handleAddLabSection = curSection => {
        setLabSection([...labSection, curSection]);
    };

    const resetFormData = () => {
        setLectureSection([]);
        setLabSection([]);
        setSelectedCourse('');
        setCourseInfo({
            id: null,
            th_name: '',
            eng_name: '',
            credit: '',
            course_type: ''
        });
    };

    const handleSubmit = async () => {
        try {
            const mergedSections = [...lectureSection, ...labSection];
            const groupData = {
                mergedSections,
                course_id: courseInfo.id,
                group_status: 'waiting',
                owner_branch_tag: ownerBranchTag
            };
            console.log(mergedSections)
            await addGroupMutation.mutateAsync(groupData);
            resetFormData();
            alert('Group added successfully');
            onClose();
        } catch (error) {
            console.error('Error adding group:', error);
            alert('Error adding groups');
        }
    };

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

    useEffect(() => {
        const { credit } = courseInfo;
        setCreditHours(parseCredits(credit));
    }, [courseInfo]);

    return isVisible ? (
        createPortal(
            <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50'>
                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4'>
                    <div className='flex'>
                        <InputSection
                            style='appearance-none border border-gray-400 p-1 rounded-md focus:outline-none focus:border-blue-500'
                            value={selectedCourse} onChange={handleCourseChange}
                            preValue='Select a course' options={courses} optionKey='combined_code_curriculum'
                        />
                        <InputField placeholder='thname' width={72} value={courseInfo.th_name} readOnly />
                        <InputField placeholder='engname' width={72} value={courseInfo.eng_name} readOnly />
                    </div>
                    <div className='flex my-4'>
                        <InputField placeholder='credit' width={20} value={courseInfo.credit} readOnly />
                        <InputField placeholder='course type' width={24} value={courseInfo.course_type} readOnly />
                    </div>
                </div>

                <div className='overflow-x-scroll flex flex-col w-10/12'>
                    {(creditHours.lectureHours > 0 || creditHours.credits > 0) &&
                        <>
                            <span className='text-3xl text-white mb-2'>Lecture</span>
                            <GroupList sections={lectureSection} onAddSection={handleAddLectureSection} creditHours={creditHours} isLab={false} />
                        </>
                    }
                    {creditHours.labHours > 0 &&
                        <>
                            <span className='text-3xl text-white mt-8 mb-2'>Laboratory</span>
                            <GroupList sections={labSection} onAddSection={handleAddLabSection} creditHours={creditHours} isLab={true} />
                        </>
                    }
                </div>

                <div className='absolute bottom-0 right-0 flex mb-4 mr-8'>
                    <ButtonCom
                        style='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4'
                        text='Submit' type='button' onClick={handleSubmit}
                    />
                    <ButtonCom
                        style='rounded bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4'
                        text='Close' type='button' onClick={onClose}
                    />
                </div>
            </div>, document.getElementById('root-modal')
        )

    ) : null;
}

const InputField = ({ width, ...props }) => {
    return <input className={`w-${width} rounded-lg bg-blue-100 mx-2 p-1`} {...props} />;
}
