import { useState } from "react";
import DataTable from "react-data-table-component";
import { useDeleteCourseMutation, useUpdateCourseMutation } from "../../api/admin_api";

export default function CourseItems({ courses, onShowBranches }) {
  const [searchTerm, setSearchTerm] = useState("");

  const deleteCourseMutation = useDeleteCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses.filter(
    (
      courses // Filter the data based on the search term
    ) => courses.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteCourse = (id, code, curriculum, th, eng, credit, type) => {
    if (window.confirm(`Delete ${code} ${curriculum} ${th} ${eng} ${credit} ${type} ?`)) {
      deleteCourseMutation.mutate(id);
    }
  };

  const edit_course = (id) => {
    input_toggle(id);
  };

  const submit_edit = async (id) => {
    input_toggle(id);
    //old data
    let old_code = document.getElementById(`text_course_code_${id}`);
    let old_curriculum = document.getElementById(`text_curriculum_${id}`);
    let old_th = document.getElementById(`text_th_name_${id}`);
    let old_eng = document.getElementById(`text_eng_name_${id}`);
    let old_credit = document.getElementById(`text_credit_${id}`);
    let old_type = document.getElementById(`text_coruse_type_${id}`);
    // input value new // new value to update database
    let new_code = document.getElementById(`course_code_${id}`);
    let new_curriculum = document.getElementById(`curriculum_${id}`);
    let new_th = document.getElementById(`th_${id}`);
    let new_eng = document.getElementById(`eng_${id}`);
    let new_credit = document.getElementById(`credit_${id}`);
    let new_type = document.getElementById(`coruse_type_${id}`);

    let updatedCourseData = {
      id: id,
      course_code: new_code.value,
      curriculum: new_curriculum.value,
      th_name: new_th.value,
      eng_name: new_eng.value,
      credit: new_credit.value,
      course_type: new_type.value
    };

    let con = confirm('do you want to update course?');

    if (con) {
      try {
        const result = await updateCourseMutation.mutateAsync(updatedCourseData);
        alert(result.message);
      } catch (error) {
        console.error("Error updating course:", error);
        alert("Failed to update course. Please try again later.");
      }
    } else {
      new_code.value = old_code.textContent;
      new_curriculum.value = old_curriculum.textContent;
      new_th.value = old_th.textContent;
      new_eng.value = old_eng.textContent;
      new_credit.value = old_credit.textContent;
      new_type.value = old_type.textContent;
    }
  };

  const input_toggle = (id) => {
    let d = document;
    let code = d.getElementById(`course_code_${id}`);
    let curriculum = d.getElementById(`curriculum_${id}`);
    let th = d.getElementById(`th_${id}`);
    let eng = d.getElementById(`eng_${id}`);
    let credit = d.getElementById(`credit_${id}`);
    let type = d.getElementById(`coruse_type_${id}`);
    code.classList.toggle("hidden");
    curriculum.classList.toggle("hidden");
    th.classList.toggle("hidden");
    eng.classList.toggle("hidden");
    credit.classList.toggle("hidden");
    type.classList.toggle("hidden");
    document.getElementById(`submit-${id}`).classList.toggle("hidden");
  };

  const columns = [
    {
      name: "Course code",
      selector: (row) => row.course_code,
      sortable: true,
      cell: (row) => (
        <div>
          <p id={`text_course_code_${row.id}`}>{row.course_code}</p>
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
          <p id={`text_curriculum_${row.id}`}>{row.curriculum}</p>
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
          <p id={`text_th_name_${row.id}`}>{row.th_name}</p>

          <textarea
            className={`input-${row.id}  border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text-area"
            name=""
            id={`th_${row.id}`}
            defaultValue={row.th_name}></textarea>
        </div>
      ),
    },
    {
      name: "English Name",
      selector: (row) => row.eng_name,
      sortable: true,
      cell: (row) => (
        <div>
          <p id={`text_eng_name_${row.id}`}>{row.eng_name}</p>

          <textarea
            className={`input-${row.id} border-yellow-950 mt-3 rounded-md border-solid border-2 w-full hidden`}
            type="text"
            name=""
            id={`eng_${row.id}`}
            defaultValue={row.eng_name}></textarea>
        </div>
      ),
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      sortable: true,
      cell: (row) => (
        <div>
          <p id={`text_credit_${row.id}`}> {row.credit}</p>

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
          <p id={`text_coruse_type_${row.id}`}> {row.course_type}</p>

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
            onClick={() => submit_edit(row.id)}
            className="text-black hover:text-white bg-blue-400  hover:bg-blue-600 px-3 py-1 rounded-md border-solid border-2 border-black hidden">
            Submit
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <button className='col-span-8 rounded text-white font-bold bg-blue-500 hover:bg-blue-700 ms-10 mb-3 py-2 px-4'
        onClick={onShowBranches}>
        Return to Branch
      </button>
      <br />
      <input className='ms-10  mt-5 mb-4 px-2 py-1 rounded border'
        type='text'
        placeholder='Search by ID'
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className='ms-10 w-[90%] -z-[10]'>
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
