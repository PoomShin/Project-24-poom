import { useState } from "react";
import useAdminApi from "../../api/Admin_API";
import ConfirmationModal from "../../public/ConfirmationModal";
import DataTable from "react-data-table-component";

export default function ProfItems({ profs, onShowBranches, refetchProfs }) {
  const [searchTerm, setSearchTerm] = useState("");
  //const [editToggle, setEditToggle] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const updateProfMutation = useAdminApi().useUpdateProfMutation();
  const deleteProfMutation = useAdminApi().useDeleteProfMutation();

  const filteredData = profs.filter((prof) =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const showEdit = (id) => {
    //setEditToggle((prevState) => !prevState);
    let name = document.getElementById(`input-name-${id}`);
    let email = document.getElementById(`input-email-${id}`);
    let role = document.getElementById(`role-${id}`);
    let submit = document.getElementById(`submit-${id}`);
    name.classList.toggle("hidden");
    email.classList.toggle("hidden");
    role.classList.toggle("hidden");
    submit.classList.toggle("hidden");
  };

  const deleteUser = async (id) => {
    setDeleteUserId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteProfMutation.mutateAsync(deleteUserId);
      refetchProfs();
      setDeleteUserId(null);
    } catch (error) {
      console.error(error);
      alert("An error occurred during delete");
    }
  };

  const submitEdit = async (id) => {
    showEdit(id);

    let roleSelect = document.getElementById("role-select-" + id);
    let changeRoleValue = roleSelect.value;
    let name = document.getElementById(`input-name-${id}`).value;
    let email = document.getElementById(`input-email-${id}`).value;

    try {
      await updateProfMutation.mutateAsync({
        id,
        name,
        email,
        role: changeRoleValue,
      });
      refetchProfs();
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
      selector: (row) => row.name,
      cell: (row) => (
        <>
          <div className="flex flex-col overflow-hidden">
            <p id={`name-${row.id}`}>{row.name}</p>
            <input
              className={`mt-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 hidden`}
              id={`input-name-${row.id}`}
              type="text"
              defaultValue={row.name}
            />
          </div>
        </>
      ),
    },

    {
      name: "Email",
      sortable: true,
      selector: (row) => row.email,
      cell: (row) => (
        <>
          <div className="flex flex-col overflow-hidden">
            <p id={`email-${row.id}`}>{row.email}</p>
            <input
              className={`mt-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 hidden`}
              id={`input-email-${row.id}`}
              type="text"
              defaultValue={row.email}
            />
          </div>
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
      selector: (row) => row.role,
      cell: (row) => (
        <>
          <div className="flex flex-col justify-center items-center">
            <p className="me-3 ">{row.role}</p>
            {/* change role dropdown */}
            <form action="" className={`hidden`} id={`role-${row.id}`}>
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
      selector: (row) => [row.id],
      cell: (row) => (
        <div>
          <button
            className="text-nowrap text-black hover:text-white bg-red-400  hover:bg-red-600 px-3 py-1 rounded-md border-solid border-2 border-black me-2"
            onClick={(e) => deleteUser(row.id, e)}>
            Delete
          </button>
          <button
            className=" text-nowrap text-black hover:text-white bg-green-400  hover:bg-green-600 px-3 py-1 rounded-md border-solid border-2 border-black me-2"
            onClick={(e) => showEdit(row.id)}>
            Edit
          </button>
          <button
            className={`me-2 text-black hover:text-white bg-blue-400  hover:bg-blue-600 px-3 py-1 rounded-md border-solid border-2 border-black  
              hidden`}
            id={`submit-${row.id}`}
            onClick={(e) => submitEdit(row.id)}>
            Submit
          </button>
          <ConfirmationModal
            isOpen={deleteUserId === row.id}
            message={`Are you sure you want to delete ${row.name}?`}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteUserId(null)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <button
        className="col-span-8 rounded font-bold text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 ms-10"
        onClick={onShowBranches}>
        <span>Return to Branch</span>
      </button>
      <br />

      {/* Search input */}
      <input
        className="rounded border mt-5 mb-4 ms-10 px-2 py-1"
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="w-[90%] ms-10">
        <DataTable
          columns={columns}
          data={filteredData}
          defaultSortFieldId={1}
          highlightOnHover
          striped
          responsive
          pagination
        />
      </div>
    </>
  );
}