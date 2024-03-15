import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCoursesContext, useGroupContext } from '../../context/Prof-Context';
import { useAddGroupMutation } from '../../api/Profs_API';
//Components
import AlertModal from '../../public/AlertModal';
import InputSection from '../components/InputSelect';
import ButtonCom from '../components/ButtonCom';
import InsertGroups from './InsertGroups';

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

export default function InsertCourseModal({ ownerBranchTag, isVisible, onClose, refetchGroupsStatus }) {
    const addGroupMutation = useAddGroupMutation();
    const { groupsByBranch, refetchGroupsByBranch } = useGroupContext();
    const { courses, refetchProfCourses } = useCoursesContext();

    const [selectedCourse, setSelectedCourse] = useState('');
    const [courseInfo, setCourseInfo] = useState({
        id: null,
        th_name: '',
        eng_name: '',
        credit: '',
        course_type: ''
    });
    const [creditHours, setCreditHours] = useState({ lectureHours: 0, labHours: 0, selfStudyHours: 0 });

    const [lectureGroups, setLectureGroups] = useState([]);
    const [labGroups, setLabGroups] = useState([]);
    const [mergedGroups, setMergedGroups] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleCourseChange = selectedOption => setSelectedCourse(selectedOption);

    const handleAddSection = (section, setter) => setter(prevSections => [...prevSections, section]);

    const resetFormData = () => {
        setLectureGroups([]);
        setLabGroups([]);
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
            const groupData = {
                mergedGroups,
                course_id: courseInfo.id,
                group_status: 'waiting',
                owner_branch_tag: ownerBranchTag
            };
            await addGroupMutation.mutateAsync(groupData);
            await refetchGroupsByBranch();
            await refetchGroupsStatus();
            await refetchProfCourses();
            resetFormData();
            setAlertMessage('Add groups successfully');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error adding group:', error);
            setAlertMessage('Error adding groups');
            setOpenAlert(true);
        }
    };

    const closeModal = () => {
        setSelectedCourse('');
        onClose();
    }

    const closeAlert = () => {
        setOpenAlert(false)
        onClose();
    }

    useEffect(() => {
        const selectedCourseData = courses?.find(course => course.combined_code_curriculum === selectedCourse);
        if (selectedCourseData) {
            setCourseInfo({
                id: selectedCourseData.id,
                th_name: selectedCourseData.th_name,
                eng_name: selectedCourseData.eng_name,
                credit: selectedCourseData.credit,
                course_type: selectedCourseData.course_type
            });
        } else {
            setCourseInfo({
                id: null,
                th_name: '',
                eng_name: '',
                credit: '',
                course_type: ''
            });
        }
    }, [selectedCourse, courses]); //reset formdata when change selected course

    useEffect(() => {
        const { credit } = courseInfo;
        setCreditHours(parseCredits(credit));
    }, [courseInfo]);

    useEffect(() => {
        setMergedGroups([...lectureGroups, ...labGroups]);
    }, [lectureGroups, labGroups]); //update mergedGroups

    return isVisible ? (
        createPortal(
            <>
                <AlertModal isOpen={openAlert} onClose={closeAlert} message={alertMessage} />
                <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50'>
                    <div className='absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4'>
                        <div className='flex'>
                            <InputSection
                                style='appearance-none border border-gray-400 p-1 rounded-md focus:outline-none focus:border-blue-500 w-48'
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                placeholder='Select a course'
                                options={courses}
                                optionKey='combined_code_curriculum'
                            />
                            <input className='w-72 rounded-lg bg-blue-100 mx-2 p-1' placeholder='thname' value={courseInfo.th_name} readOnly />
                            <input className='w-72 rounded-lg bg-blue-100 mx-2 p-1' placeholder='engname' value={courseInfo.eng_name} readOnly />
                        </div>
                        <div className='flex my-4'>
                            <input className='w-20 rounded-lg bg-blue-100 mx-2 p-1' placeholder='credit' value={courseInfo.credit} readOnly />
                            <input className='w-24 rounded-lg bg-blue-100 mx-2 p-1' placeholder='course type' value={courseInfo.course_type} readOnly />
                        </div>
                    </div>

                    <InsertGroups
                        creditHours={creditHours}
                        lectureGroups={lectureGroups} labGroups={labGroups} mergedGroups={mergedGroups}
                        handleAddSection={handleAddSection}
                        setLectureGroups={setLectureGroups} setLabGroups={setLabGroups}
                        setDisableSubmit={setDisableSubmit}
                        groupsByBranch={groupsByBranch}
                    />

                    <div className='absolute bottom-0 right-0 flex mb-4 mr-8'>
                        <ButtonCom style='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4'
                            text='Submit' type='button' onClick={handleSubmit}
                            isDisable={disableSubmit || selectedCourse === ''}
                        />
                        <ButtonCom style='rounded bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4'
                            text='Close' type='button' onClick={closeModal}
                        />
                    </div>
                </div>
            </>, document.getElementById('root-modal')
        )
    ) : null;
}