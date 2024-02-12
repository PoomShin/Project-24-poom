export default function ProfItems({ profs, onShowBranches }) {
    return (
        <div className="grid grid-cols-8 auto-rows-auto gap-y-16 mx-4 justify-items-center bg-green-200 border-2 border-black">

            {/* Button to return to Content.jsx */}
            <button className="col-span-8 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                onClick={onShowBranches}
            >
                <span>Return to Branch</span>
            </button>

            {/* Column Headers */}
            <div className="col-span-2 font-bold">Name</div>
            <div className="col-span-2 font-bold">Email</div>
            <div className="col-span-2 font-bold">Branch Tag</div>
            <div className="col-span-2 font-bold">Role</div>

            {/* Data Rows */}
            {profs.map((prof) => (
                <React.Fragment key={prof.id}>
                    <div className="col-span-2">{prof.name}</div>
                    <div className="col-span-2">{prof.email}</div>
                    <div className="col-span-2">{prof.branchtag}</div>
                    <div className="col-span-2">{prof.role}</div>
                </React.Fragment>
            ))}
        </div>
    );
}
import React from "react";