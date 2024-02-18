import { useState } from 'react';
import { createPortal } from 'react-dom';

function InputField({ width, ...props }) {
    return <input className={`mx-2 p-1 rounded-lg bg-blue-100 w-${width}`}
        {...props}
    />;
}

export default function InsertCourseModal({ isVisible, onClose }) {
    return isVisible ? (
        <PortalContainer>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 p-4'>
                <div className='flex'>
                    <InputField placeholder='course-code-curriculum' />
                    <InputField placeholder='thname' width={64} />
                    <InputField placeholder='engname' width={64} />
                </div>
                <hr className='my-4' />
                <div className='flex'>
                    <InputField placeholder='credit' />
                    <InputField placeholder='course type' />
                </div>

            </div>

            <div className='flex flex-col w-10/12'>
                <span className='text-3xl text-white mb-2'>Lecture</span>
                <div className='h-64 flex overflow-x-auto bg-green-100 p-4'>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                    <div className='h-full min-w-72 rounded-md bg-slate-700 mr-4'></div>
                </div>

                <hr className='my-12' />
            </div>

            <div className="absolute flex bottom-0 right-0 mb-4 mr-8">
                <button
                    className='rounded bg-green-500 hover:bg-green-700 text-white font-bold mr-4 py-2 px-4'
                    type='button'
                >
                    Submit
                </button>
                <button
                    className='rounded bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4'
                    onClick={onClose}
                    type='button'
                >
                    Close
                </button>
            </div>

        </PortalContainer>
    ) : undefined;
}

const PortalContainer = ({ children }) => {
    return createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-800 bg-opacity-50 z-50">
            {children}
        </div>,
        document.getElementById('root-modal')
    );
};
