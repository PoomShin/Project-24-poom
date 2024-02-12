export default function CourseItems({ courses, onShowBranches }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='grid grid-cols-8 justify-items-center auto-rows-auto gap-y-16 mx-4 border-black bg-sky-200 border-2 '>
            <input className="col-span-8 p-2 border rounded-md border-gray-300"
                type="text"
                placeholder="Search by Course Code"
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {/* Rest of your course items rendering */}
            <button className="col-span-8 font-bold py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-700"
                onClick={onShowBranches}
            >
                Return to Branch
            </button>

            <div className="col-span-1 font-bold">course code</div>
            <div className="col-span-1 font-bold">curriculum</div>
            <div className="col-span-2 font-bold">thname</div>
            <div className="col-span-2 font-bold">engname</div>
            <div className="col-span-1 font-bold">credit</div>
            <div className="col-span-1 font-bold">course</div>

            {/* Data Rows */}
            {courses.map((course) => (
                <React.Fragment key={course.id}>
                    <div className="col-span-1">{course.coursecode}</div>
                    <div className="col-span-1">{course.curriculum}</div>
                    <div className="col-span-2">{course.thname}</div>
                    <div className="col-span-2">{course.engname}</div>
                    <div className="col-span-1">{course.credit}</div>
                    <div className="col-span-1">{course.coursetype}</div>
                </React.Fragment>
            ))}
        </div>
    )
}

import React, { useState } from "react";