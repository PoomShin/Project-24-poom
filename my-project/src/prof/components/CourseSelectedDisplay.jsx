import React, { useMemo } from 'react';
import Select from 'react-select';

const CourseSelect = ({ value, placeholder, options, onChange }) => (
    <Select
        className='appearance-none border border-gray-400 p-1 rounded-md focus:outline-none focus:border-blue-500 w-48'
        value={value ? { value, label: value } : null}
        onChange={selectedOption => onChange(selectedOption?.value || '')}
        options={options}
        placeholder={placeholder}
    />
);

const ReadOnlyInput = ({ placeholder, value, width }) => (
    <input className={`rounded-lg bg-blue-100 mx-2 p-1 ${width}`}
        placeholder={placeholder}
        value={value}
        readOnly
    />
);

export default function CourseSelectedDisplay({ coursesBranch, courseInfo, onCourseChange }) {
    const selectOptions = useMemo(() => (
        coursesBranch.map(option => ({
            value: option.combined_code_curriculum,
            label: option.combined_code_curriculum
        }))
    ), [coursesBranch]);

    return (
        <>
            <div className='flex'>
                <CourseSelect
                    value={courseInfo.selectedCourse}
                    placeholder='Select a course'
                    options={selectOptions}
                    onChange={onCourseChange}
                />
                <ReadOnlyInput placeholder='thname' value={courseInfo.th_name} width='w-72' />
                <ReadOnlyInput placeholder='engname' value={courseInfo.eng_name} width='w-72' />
            </div>
            <div className='flex my-4'>
                <ReadOnlyInput placeholder='credit' value={courseInfo.credit} width='w-20' />
                <ReadOnlyInput placeholder='course type' value={courseInfo.course_type} width='w-24' />
            </div>
        </>
    );
}