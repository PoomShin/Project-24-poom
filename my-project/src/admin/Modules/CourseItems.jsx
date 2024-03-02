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

  const edit_course = (id) => {
    let d = document;

    let code = d.getElementById(`course_code_${id}`);
    let curriculum = d.getElementById(`curriculum_${id}`);
    let th = d.getElementById(`th_${id}`);
    let eng = d.getElementById(`eng_${id}`);
    let credit = d.getElementById(`credit_${id}`);
    let type = d.getElementById(`coruse_type_${id}`);
    //
    code.classList.toggle("hidden");
    curriculum.classList.toggle("hidden");
    th.classList.toggle("hidden");
    eng.classList.toggle("hidden");
    credit.classList.toggle("hidden");
    type.classList.toggle("hidden");
    d.getElementById(`submit-${id}`).classList.toggle("hidden")
    alert(
      `Edit ${code.value} ${curriculum.value} ${th.value} ${eng.value} ${credit.value} ${type.value}`
    );
  };

  const columns = [
    {
      name: "Course code",
      selector: (row) => row.course_code,
      sortable: true,
      cell: (row) => (
        <div>
          {row.course_code}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`course_code_${row.id}`}
            defaultValue={row.course_code}
          />
        </div>
      ),
    },
    {
      name: "Curriculum",
      selector: (row) => row.curriculum,
      sortable: true,
      cell: (row) => (
        <div>
          {row.curriculum}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`curriculum_${row.id}`}
            defaultValue={row.curriculum}
          />
        </div>
      ),
    },
    {
      name: "Thai Name",
      selector: (row) => row.th_name,
      sortable: true,
      cell: (row) => (
        <div>
          {row.th_name}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`th_${row.id}`}
            defaultValue={row.th_name}  
            
          />
        </div>
      ),
    },
    {
      name: "English Name",
      selector: (row) => row.eng_name,
      sortable: true,
      cell: (row) => (
        <div>
          {row.eng_name}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`eng_${row.id}`}
            defaultValue={row.eng_name}
          />
        </div>
      ),
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      sortable: true,
      cell: (row) => (
        <div>
          {row.eng_name}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`credit_${row.id}`}
            defaultValue={row.credit}
          />
        </div>
      ),
    },
    {
      name: "Course Type",
      selector: (row) => row.course_type,
      sortable: true,
      cell: (row) => (
        <div>
          {row.course_type}
          <input
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`coruse_type_${row.id}`}
            defaultValue={row.course_type}
          />
        </div>
      ),
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
    {
      name: "Edit",
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
        <div className="flex">
          <button
            onClick={() =>
              edit_course(
                row.id,
                row.course_code,
                row.curriculum,
                row.th_name,
                row.eng_name,
                row.credit,
                row.course_type
              )
            }
            className="w-14 text-black hover:text-white bg-green-400  hover:bg-green-600 px-3 py-1 rounded-md border-solid border-2 border-black">
            Edit
          </button>
        </div>
      ),
    },
    {
      name: "",
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
        <div className="flex">
          <button
            id={`submit-${row.id}`}
            className="text-black hover:text-white bg-blue-400  hover:bg-blue-600 px-3 py-1 rounded-md border-solid border-2 border-black hidden">
            Submit
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
