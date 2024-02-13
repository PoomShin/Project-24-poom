import React from "react";
import DataTable from 'react-data-table-component';

export default function ProfItems({ profs, onShowBranches }) {
  return (
    <>
      <button
        className="col-span-8 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={onShowBranches}>
        <span>Return to Branch</span>
      </button>

      <table className="table-auto w-[95%] text-center border-solid border-2 border-slate-950 ms-4 break-before-page">
        <thead className="border-solid border-2 border-slate-950">
          <tr>
            <th className="border-solid border-2 border-slate-950">Name</th>
            <th className="border-solid border-2 border-slate-950">Email</th>
            <th className="border-solid border-2 border-slate-950">Branch</th>
            <th className="border-solid border-2 border-slate-950">Role</th>
          </tr>
        </thead>
        <tbody>
          {profs.map((prof) => (
            <tr key={prof.id} className="border-solid border-2 border-slate-950">
              <td className="border-solid border-2 border-slate-950">{prof.name}</td>
              <td className="border-solid border-2 border-slate-950">{prof.email}</td>
              <td className="border-solid border-2 border-slate-950">{prof.branchtag}</td>
              <td className="border-solid border-2 border-slate-950">{prof.role}</td>                    
            </tr>
          ))}
        </tbody>
      </table>
      
    </>
  );
}





