import { useState } from 'react';
import { createPortal } from 'react-dom';
import GroupAdd from '../Modules/GroupAdd';
import GroupItem from '../Modules/GroupItem';
import { useCoursesContext } from '../../context/Prof-Context';

export default function InsertCourseModal({ isVisible, onClose }) {
    const [lectureSection, setLectureSection] = useState([]);
    const [labSection, setLabSection] = useState([]);

    const handleAddLectureSection = curSection => {
        setLectureSection([...lectureSection, curSection]);
    }

    const handleAddLabSection = curSection => {
        setLabSection([...labSection, curSection]);
    }

    return isVisible ? (
        <PortalContainer>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 p-4'>
                <div className='flex'>
                    <InputField placeholder='course-code-curriculum' />
                    <InputField placeholder='thname' width={64} />
                    <InputField placeholder='engname' width={64} />
                </div>
                <div className='flex my-4'>
                    <InputField placeholder='credit' />
                    <InputField placeholder='course type' />
                </div>
            </div>

            <div className='flex flex-col w-10/12'>
                <span className='text-3xl text-white mb-2'>Lecture</span>
                <SectionList sections={lectureSection} onAddSection={handleAddLectureSection} />

                <span className='text-3xl text-white mt-8 mb-2'>Laboratory</span>
                <SectionList sections={labSection} onAddSection={handleAddLabSection} isLab />
            </div>

            <div className='absolute flex bottom-0 right-0 mb-4 mr-8'>
                <button className='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4' type='button' onClick={() => { console.log(lectureSection) }}>
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
            <GroupAdd onAddSection={onAddSection} isLab={isLab} />
        </div>
    );
}