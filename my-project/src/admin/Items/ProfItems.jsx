import { React, useState } from "react";
import DataTable from "react-data-table-component";

export default function ProfItems({ profs, onShowBranches }) {
  // get data from profs
  const data = profs;
  console.log(data);

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  // Handler for updating the search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the data based on the search term
  const filteredData = profs.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //---------------ทำให้ด้วย------------------------------
  // ปุ่ม delete user (ยังไม่ลงฐานข้อมูล)
  const deleteUser = (id, e) => {
    let isconfrim = confirm(`Delete ${id} ?`);
    e.preventDefault();
    if (isconfrim) {
      //hide user
      document.getElementById(`row-${id}`).style.display = "none";
      alert(`User ID ${id} deleted`);
      //ลบจาก database v
      //write your code
      let userID = id
    } else {
      console.log("nothing");
    }
  };
  // edit user ไม่ต้องแก้
  const showEdit = (id, e) => {
    let getForm = document.getElementById("form-" + id);
    getForm.classList.toggle("invisible");
    document.getElementById(`submit-edit-${id}`).classList.toggle("hidden");
    document.getElementById(`input-name-${id}`).classList.toggle("hidden");
    document.getElementById(`input-email-${id}`).classList.toggle("hidden");
  };
  //
  const submitEdit = (id, e) => {
    e.preventDefault();
    let getForm = document.getElementById("form-" + id);
    getForm.classList.toggle("invisible");
    document.getElementById(`submit-edit-${id}`).classList.toggle("hidden");
    document.getElementById(`input-name-${id}`).classList.toggle("hidden");
    document.getElementById(`input-email-${id}`).classList.toggle("hidden");
    let roleSelect = document.getElementById("role-select-" + id);
    // value ของ role ที่เปลี่ยน
    let changeRoleValue = roleSelect.value;
    let roleText = document.getElementById("text-" + id);
    roleText.textContent = changeRoleValue;

    // ตัวแปรที่ให้ใช้
    let userID = id;
    let name = document.getElementById(`input-name-${id}`).value;
    let email = document.getElementById(`input-email-${id}`).value;
    let role = changeRoleValue;

    document.getElementById(`name-${id}`).innerText = name;
    document.getElementById(`email-${id}`).innerText = email;

    // ใช้ ID เป็น PM key ไปอ้างอิง index
    //write your code แก้แค่ตรงนี้  ----- //
    //
    alert(
      `User ID ${userID} Edited \nname : ${name} \nemail : ${email} \nrole : ${role}`
    );
  };
  //---------------------------------------------

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,

      sortable: true,
      cell: (row) => (
        <>
          <p>{row.id}</p>
        </>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "300px",
      cell: (row) => (
        <>
          <p id={`name-${row.id}`}>{row.name}</p>
          <input
            type="text"
            id={`input-name-${row.id}`}
            defaultValue={row.email}
            className="ms-2 bg-gray-200  px-2 py-1 border rounded-full border-solid border-black hidden "
          />
        </>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: "400px",
      sortable: true,
      cell: (row) => (
        <>
          <p id={`email-${row.id}`}>{row.email}</p>
          <input
            type="text"
            id={`input-email-${row.id}`}
            defaultValue={row.email}
            className="ms-2 bg-gray-200  px-2 py-1 border rounded-full border-solid border-black hidden "
          />
        </>
      ),
    },
    {
      name: "Branch",
      selector: (row) => row.branchtag,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "250px",
      sortable: true,
      // ใช้ id แต่ละตัว hide form // แต่ละปุ่มมี id ของมันเอง
      cell: (row) => (
        <>
          <div className="flex justify-start items-center">
            <div className="flex">
              {/* id=text-number */}
              <p id={`text-${row.id}`} className="me-3">
                {row.role}
              </p>
            </div>
            {/* dropdown form */}
            {/* form-number --> กดปุ่มเพื่อเปิด อ้างอิงจาก form-number*/}
            <form action="" id={`form-${row.id}`} className={`flex invisible `}>
              {/* role-select-number */}
              <select
                id={`role-select-${row.id}`}
                className={`px-2 border border-black rounded-2xl border-solid hover:bg-slate-300`}>
                <option value="Professor">Professor</option>
                <option value="Professor(SM)">Professor(SM)</option>
              </select>
            </form>
            {/* end dropdown */}
          </div>
        </>
      ),
    },
    {
      name: "Action",
      width: "200px",
      cell: (row) => (
        <>
          <button
            onClick={(e) => showEdit(row.id, e)}
            className="text-green-500 me-2">
            Edit
          </button>
          <button
            onClick={(e) => deleteUser(row.id, e)}
            className="text-red-500 me-2">
            Delete
          </button>
          <button
            id={`submit-edit-${row.id}`}
            onClick={(e) => submitEdit(row.id, e)}
            className="text-blue-500 me-2 hidden">
            Submit
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <button
        className="ms-10 col-span-8 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={onShowBranches}>
        <span>Return to Branch</span>
      </button>
      <br />
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="ms-10 mb-4 px-2 py-1 rounded border mt-5"
      />

      <div className="ms-10 w-[90%]">
        <DataTable columns={columns} data={filteredData}  highlightOnHover
          striped
          responsive
          pagination />
      </div>
    </>
  );
}
