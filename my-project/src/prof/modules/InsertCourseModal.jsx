import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCoursesContext } from '../../context/Prof-Context';
import { useAddGroupMutation } from '../../api/Profs_API';
import { useMergedGroups } from '../CustomHook/useMergedGroups';
//Components
import AlertModal from '../../public/AlertModal';
import CourseSelectedDisplay from '../components/CourseSelectedDisplay';
import InsertGroupsCards from './InsertGroupsCards';
import ButtonCom from '../components/ButtonCom';
//data
import { initialCourseInfoState, initialCreditHour } from '../data/initialData';
import { parseCredits } from '../data/functions';

export default function InsertCourseModal({ ownerProfBranch, isVisible, onClose }) {
    const { coursesBranch } = useCoursesContext(); //for checking if this prop have ovelappign course with yourself
    const addGroupMutation = useAddGroupMutation();

    const [courseInfo, setCourseInfo] = useState(initialCourseInfoState);
    const [creditHours, setCreditHours] = useState(initialCreditHour);

    const [lectureGroups, setLectureGroups] = useState([]);
    const [labGroups, setLabGroups] = useState([]);
    const mergedGroups = useMergedGroups(lectureGroups, labGroups);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleCourseChange = (selectedOption) => {
        setCourseInfo(prevState => ({
            ...prevState,
            selectedCourse: selectedOption
        }));
    };

    const resetFormData = () => {
        setLectureGroups([]);
        setLabGroups([]);
        setCreditHours(initialCreditHour);
        setCourseInfo(initialCourseInfoState);
    };
    const handleSubmit = async () => {
        try {
            const groupData = {
                mergedGroups,
                course_id: courseInfo.id,
                group_status: 'waiting',
                owner_branch_tag: ownerProfBranch
            };
            await addGroupMutation.mutateAsync(groupData);
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
        onClose();
    }
    const closeAlert = () => {
        setOpenAlert(false)
        onClose();
    }

    useEffect(() => {
        const selectedCourseData = coursesBranch?.find(course => course.combined_code_curriculum === courseInfo.selectedCourse);
        if (selectedCourseData) {
            setCourseInfo(prevState => ({
                ...prevState,
                id: selectedCourseData.id,
                th_name: selectedCourseData.th_name,
                eng_name: selectedCourseData.eng_name,
                credit: selectedCourseData.credit,
                course_type: selectedCourseData.course_type
            }));
            setCreditHours(parseCredits(courseInfo.credit));
        } else setCourseInfo(initialCourseInfoState);
    }, [courseInfo.selectedCourse, courseInfo.credit]);

    return isVisible &&
        createPortal(
            <>
                <AlertModal isOpen={openAlert} onClose={closeAlert} message={alertMessage} />
                <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50'>

                    <div className='absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4'>
                        <CourseSelectedDisplay coursesBranch={coursesBranch} courseInfo={courseInfo} onCourseChange={handleCourseChange} />
                    </div>

                    <div className='overflow-x-scroll flex flex-col gap-y-2 w-10/12'>
                        <InsertGroupsCards
                            creditHours={creditHours}
                            lectureGroups={lectureGroups} labGroups={labGroups} mergedGroups={mergedGroups}
                            setLectureGroups={setLectureGroups} setLabGroups={setLabGroups}
                            setDisableSubmit={setDisableSubmit}
                        />
                    </div>

                    <div className='absolute bottom-0 right-0 flex mb-4 mr-8'>
                        <ButtonCom style=' mr-4 py-2 px-4 text-white font-bold bg-green-500 hover:bg-green-700'
                            text='Submit' type='button'
                            onClick={handleSubmit}
                            isDisable={disableSubmit || courseInfo.selectedCourse === ''}
                        />
                        <ButtonCom style='py-2 px-4 text-white font-bold bg-red-500 hover:bg-red-700'
                            text='Close' type='button'
                            onClick={closeModal}
                        />
                    </div>
                </div>
            </>, document.getElementById('root-modal')
        )
}