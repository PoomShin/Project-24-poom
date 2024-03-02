import { useState } from "react";
import DataTable from "react-data-table-component";

export default function CourseItems({ courses, onShowBranches }) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses.filter(
    (
      courses // Filter the data based on the search term
    ) => courses.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteCourse = (id, code, curriculum, th, eng, credit, type) => {
    confirm(`Delete ${code} ${curriculum} ${th} ${eng} ${credit} ${type} ?`);
    document.getElementById(`row-${id}`).style.display = "none";
    // อย่าลบ real-time delete tytytytytytytytytytytytytyty
    // ใช้ id ลบ course :)))))))))))))))))))))))))))))))))))))))))))))))))))))
  };

  const columns = [
    {
      name: "Course code",
      selector: (row) => row.course_code,
      sortable: true,
    },
    {
      name: "Curriculum",
      selector: (row) => row.curriculum,
      sortable: true,
    },
    {
      name: "Thai Name",
      selector: (row) => row.th_name,
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>
          {row.th_name}
        </div>
      ),
    },
    {
      name: "English Name",
      selector: (row) => row.eng_name,
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>
          {row.eng_name}
        </div>
      ),
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      sortable: true,
    },
    {
      name: "Course Type",
      selector: (row) => row.course_type,
      sortable: true,
    },
    {
      name: "Delete",
      selector: (row) => [
        row.id,
        row.course_code,
        row.curriculum,
        row.th_name,
        row.eng_name,
        row.credit,
        row.course_type,
      ],
      cell: (row) => (
        <div>
          <button
            className="text-black hover:text-white bg-red-400  hover:bg-red-600 px-3 py-1 rounded-md border-solid border-2 border-black"
            onClick={() => {
              deleteCourse(
                row.id,
                row.course_code,
                row.curriculum,
                row.th_name,
                row.eng_name,
                row.credit,
                row.course_type
              );
            }}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <button
        className="col-span-8 rounded text-white font-bold bg-blue-500 hover:bg-blue-700 ms-10 mb-3 py-2 px-4"
        onClick={onShowBranches}>
        Return to Branch
      </button>
      <br />
      <input
        className="ms-10  mt-5 mb-4 px-2 py-1 rounded border"
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="ms-10 w-[90%] -z-[10]">
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
