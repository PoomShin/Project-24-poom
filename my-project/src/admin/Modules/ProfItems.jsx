import { useState } from "react";
import {
  useUpdateProfMutation,
  useDeleteProfMutation,
} from "../../context/Admin-Context";
import DataTable from "react-data-table-component";

export default function ProfItems({ profs, onShowBranches }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editToggle, setEditToggle] = useState(false);

  const updateProfMutation = useUpdateProfMutation();
  const deleteProfMutation = useDeleteProfMutation();

  const filteredData = profs.filter(
    (
      prof // Filter the data based on the search term
    ) => prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const deleteUser = async (id) => {
    let isConfirm = window.confirm(`Delete ${id} ?`);
    if (isConfirm) {
      try {
        document.getElementById(`row-${id}`).style.display = "none";
        await deleteProfMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);
        alert("An error occurred during delete");
      }
    }
  };

  const showEdit = () => {
    setEditToggle((prevState) => !prevState);
  };

  const submitEdit = async (id) => {
    showEdit();

    let roleSelect = document.getElementById("role-select-" + id);
    let changeRoleValue = roleSelect.value;
    let name = document.getElementById(`input-name-${id}`).value;
    let email = document.getElementById(`input-email-${id}`).value;

    try {
      const result = await updateProfMutation.mutateAsync({
        id,
        name,
        email,
        role: changeRoleValue,
      });
      alert(result.message);
    } catch (error) {
      console.error(error);
      alert("An error occurred during update");
    }
  };

  const columns = [
    {
      name: "ID",
      sortable: true,
      selector: (row) => row.id,
      cell: (row) => <p>{row.id}</p>,
    },

    {
      name: "Name",
      sortable: true,
      width: "300px",
      selector: (row) => row.name,
      cell: (row) => (
        <>
          <p id={`name-${row.id}`}>{row.name}</p>
          <input
            className={`ms-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 ${
              !editToggle && "hidden"
            }`}
            id={`input-name-${row.id}`}
            type="text"
            defaultValue={row.name}
          />
        </>
      ),
    },

    {
      name: "Email",
      sortable: true,
      width: "400px",
      selector: (row) => row.email,
      cell: (row) => (
        <>
          <p id={`email-${row.id}`}>{row.email}</p>
          <input
            className={`ms-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 ${
              !editToggle && "hidden"
            }`}
            id={`input-email-${row.id}`}
            type="text"
            defaultValue={row.email}
          />
        </>
      ),
    },

    {
      name: "BranchTag",
      sortable: true,
      selector: (row) => row.branch_tag,
    },

    {
      name: "Role",
      sortable: true,
      width: "250px",
      selector: (row) => row.role,
      cell: (row) => (
        <>
          <div className="flex justify-start items-center">
            <div className="flex">
              <p className="me-3">{row.role}</p>
            </div>

            {/* change role dropdown */}
            <form action="" className={`flex ${!editToggle && "invisible"}`}>
              <select
                className="px-2 border rounded-2xl border-solid border-black hover:bg-slate-300"
                id={`role-select-${row.id}`}>
                <option value="prof">prof</option>
                <option value="prof(SM)">prof(SM)</option>
              </select>
            </form>
          </div>
        </>
      ),
    },

    {
      name: "Action",
      width: "200px",
      cell: (row) => (
        <>
          <button className="me-2 text-green-500" onClick={(e) => showEdit()}>
            Edit
          </button>
          <button
            className="me-2 text-red-500"
            onClick={(e) => deleteUser(row.id, e)}>
            Delete
          </button>
          <button
            className={`me-2 text-blue-500 ${!editToggle && "hidden"}`}
            onClick={(e) => submitEdit(row.id)}>
            Submit
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <button
        className="col-span-8 py-2 px-4 ms-10 rounded font-bold text-white bg-blue-500 hover:bg-blue-700"
        onClick={onShowBranches}>
        <span>Return to Branch</span>
      </button>
      <br />

      {/* Search input */}
      <input
        className="mt-5 mb-4 ms-10 px-2 py-1 rounded border"
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="ms-10 w-[90%]">
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
