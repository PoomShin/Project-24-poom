export default function ProfItems({ profs, onShowBranches }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editToggle, setEditToggle] = useState(false);
  //backend
  const { mutate: updateProf } = useUpdateProfMutation();
  const { mutate: deleteProf } = useDeleteProfMutation();

  const filteredData = profs.filter((prof) =>   // Filter the data based on the search term
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // delete user not import to db yet!
  const deleteUser = (id) => {
    let isConfirm = window.confirm(`Delete ${id} ?`);
    if (isConfirm) deleteProf(id);
  };

  const showEdit = () => {
    setEditToggle(prevState => !prevState);
  };

  const submitEdit = (id) => {
    showEdit();

    // change in roll
    let roleSelect = document.getElementById('role-select-' + id);
    let changeRoleValue = roleSelect.value;
    let name = document.getElementById(`input-name-${id}`).value;
    let email = document.getElementById(`input-email-${id}`).value;
    let role = changeRoleValue;

    updateProf({ id, name, email, role });
  };

  const columns = [
    {
      name: 'ID', sortable: true,
      selector: (row) => row.id,
      cell: (row) => (
        <p>{row.id}</p>
      ),
    },

    {
      name: 'Name', sortable: true, width: '300px',
      selector: (row) => row.name,
      cell: (row) => (
        <>
          <p>{row.name}</p>
          <input className={`ms-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 ${!editToggle && 'hidden'}`}
            id={`input-name-${row.id}`}
            type='text'
          />
        </>
      ),
    },

    {
      name: 'Email', sortable: true, width: '400px',
      selector: (row) => row.email,
      cell: (row) => (
        <>
          <p>{row.email}</p>
          <input className={`ms-2 px-2 py-1 border rounded-full border-solid border-black bg-gray-200 ${!editToggle && 'hidden'}`}
            id={`input-email-${row.id}`}
            type='text'
          />
        </>
      ),
    },

    {
      name: 'Branch', sortable: true,
      selector: (row) => row.branchtag,
    },

    {
      name: 'Role', sortable: true, width: '350px',
      selector: (row) => row.role,
      cell: (row) => (
        <>
          <div className='flex justify-start items-center'>
            <div className='flex'>
              <p className='me-3'>{row.role}</p>
            </div>

            {/* change role dropdown */}
            <form action='' className={`flex ${!editToggle && 'invisible'}`}>
              <select className='px-2 border rounded-2xl border-solid border-black hover:bg-slate-300'
                id={`role-select-${row.id}`}
              >
                <option value='Prof'>Prof</option>
                <option value='Prof(SM)'>Prof(SM)</option>
              </select>
            </form>
          </div>
        </>
      ),
    },

    {
      name: 'Action', width: '200px',
      cell: (row) => (
        <>
          <button className='me-2 text-green-500'
            onClick={(e) => showEdit()}
          >
            Edit
          </button>
          <button className='me-2 text-red-500'
            onClick={(e) => deleteUser(row.id, e)}
          >
            Delete
          </button>
          <button className={`me-2 text-blue-500 ${!editToggle && 'hidden'}`}
            onClick={(e) => submitEdit(row.id)}
          >
            Submit
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <button className='col-span-8 py-2 px-4 ms-10 rounded font-bold text-white bg-blue-500 hover:bg-blue-700'
        onClick={onShowBranches}>
        <span>Return to Branch</span>
      </button>
      <br />

      {/* Search input */}
      <input className='mt-5 mb-4 ms-10 px-2 py-1 rounded border'
        type='text'
        placeholder='Search by name'
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className='ms-10 w-[90%]'>
        <DataTable columns={columns} data={filteredData} pagination />
      </div>
    </>
  );
}

//backend code
const useUpdateProfMutation = () => {
  return useMutation(
    async (prof) => {
      try {
        const response = await axios.put(`/admin/updateProf/${prof.id}`, prof);
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.error || 'Unknown error');
      }
    },
    {
      onSuccess: (data) => {
        if (data.success) alert('Professor updated successfully');
        else alert(data.error || 'Unknown error');
      },
      onError: (error) => {
        console.error(error.message);
        alert('An error occurred during update');
      },
    }
  );
};

const useDeleteProfMutation = () => {
  return useMutation(
    async (id) => {
      try {
        const response = await axios.delete(`/admin/deleteProf/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.error || 'Unknown error');
      }
    },
    {
      onSuccess: (data) => {
        if (data.success) alert(data.message);
        else alert(data.error || 'Unknown error');
      },
      onError: (error) => {
        console.error(error.message);
        alert('An error occurred during delete');
      },
    }
  );
};

import { useState } from "react";
import { useMutation } from 'react-query';
import axios from 'axios';
import DataTable from "react-data-table-component";

