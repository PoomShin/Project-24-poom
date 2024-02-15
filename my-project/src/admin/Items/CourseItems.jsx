export default function CourseItems({ courses, onShowBranches }) {

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  // Handler for updating the search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the data based on the search term
  const filteredData = courses.filter((courses) =>
  courses.coursecode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "Course code",
      selector: (row) => row.coursecode,
      sortable: true,
    },
    {
      name: "Curriculum",
      selector: (row) => row.curriculum,
      sortable: true,
    },
    {
      name: "Thai Name",
      selector: (row) => row.thname,
      sortable: true,
      cell: (row) => <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>{row.thname}</div>,
    },
    {
      name: "English Name",
      selector: (row) => row.engname,
      sortable: true,
      cell: (row) => <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>{row.engname}</div>,
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      sortable: true,
    },
    {
      name: "Course Type",
      selector: (row) => row.coursetype,
      sortable: true,
    }
  ];

  console.log(courses);

  return (
    <>
      <button
        className="ms-10 mb-3 col-span-8 font-bold py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-700"
        onClick={onShowBranches}>
        Return to Branch
      </button>
    <br />
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={handleSearch}
        className="ms-10 mb-4 px-2 py-1 rounded border mt-5"
      />

      <div className="ms-10 w-[90%] -z-[9999999999]">
        <DataTable
          columns={columns}
          data={filteredData}
          highlightOnHover
          striped
          responsive          
          pagination
        />
      </div>
    </>
  );
}

import React, { useState } from "react";
import DataTable from "react-data-table-component";
