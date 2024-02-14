export default function ProfItems({ profs, onShowBranches }) {
  const openSettingRole = (id) => {
    let getForm = document.getElementById('form-' + id);
    getForm.classList.toggle('invisible');
  };

  const changeRole = (id, e) => {
    e.preventDefault();
    let roleSelect = document.getElementById('role-select-' + id);
    let roleText = document.getElementById('text-' + id);
    roleText.textContent = roleSelect.value;
    // ใช้ id update role database
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    {
      name: 'Email',
      selector: (row) => row.email,
      width: '300px',
      sortable: true,
    },
    {
      name: 'Branch',
      selector: (row) => row.branchtag,
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role,
      width: '350px',
      sortable: true,
      cell: (row) => (
        <>
          <div className='flex justify-start items-center'>
            <div className='flex'>
              {/* id=text-number */}
              <p id={`text-${row.id}`} className='me-3'>
                {row.role}
              </p>

              <span className='material-symbols-outlined me-4 cursor-pointer'
                id={`setting-${row.id} `}
                onClick={() => openSettingRole(row.id)}
              >
                settings
              </span>
            </div>
            {/* dropdown form, form-number --> กดปุ่มเพื่อเปิด อ้างอิงจาก form-number */}
            <form action='' id={`form-${row.id}`} className='flex invisible'>
              {/* role-select-number */}
              <select
                id={`role-select-${row.id}`}
                className='px-2 border border-black rounded-2xl border-solid hover:bg-slate-300'
              >
                <option value='Professor'>Professor</option>
                <option value='Professor(SM)'>Professor(SM)</option>
              </select>
              <button className='ms-1 p-[3px] min-w-[60px] bg-green-300 rounded-3xl hover:bg-green-600 border-solid border-2 border-sky-500 '
                type=''
                onClick={(e) => changeRole(row.id, e)}
              >
                Change
              </button>
            </form>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <button className='ms-10 col-span-8 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4'
        onClick={onShowBranches}
      >
        <span>Return to Branch</span>
      </button>

      <div className='ms-10 mt-10 w-[90%]'>
        <DataTable columns={columns} data={profs} pagination />
      </div>
    </>
  );
}

import DataTable from 'react-data-table-component';