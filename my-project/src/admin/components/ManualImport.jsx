import { useState } from 'react';
import { courseTypes } from '../data_functions/constantData';
import { initialRowState } from '../data_functions/initialData';

const ManualTableImport = ({ yearOptions, rows, handleInputChange, handleDeleteRow, btnSubmit }) => (
  <form action='' className='relative'>
    <table
      id='tableID'
      className='w-full text-center border-2 border-solid border-black'
    >
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Curriculum</th>
          <th>TH name</th>
          <th>Eng name</th>
          <th>Credits</th>
          <th>Course type</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr className='relative border border-solid border-black'
            key={index}
          >
            <td>
              <input className='courseCode border border-solid border-black'
                required
                type='text'
                name={`courseCode_${index}`}
                value={row.courseCode}
                onChange={e => handleInputChange(index, 'courseCode', e.target.value)}
              />
            </td>
            <td>
              <select className='curriculum border border-solid border-black'
                name={`curriculum_${index}`}
                value={row.curriculum}
                onChange={e => handleInputChange(index, 'curriculum', e.target.value)}>
                {yearOptions}
              </select>
            </td>
            <td>
              <input className='thName border border-solid border-black'
                required
                type='text'
                name={`thName_${index}`}
                placeholder='th'
                value={row.thName}
                onChange={e => handleInputChange(index, 'thName', e.target.value)}
              />
            </td>
            <td>
              <input
                required className='engName border border-solid border-black'
                type='text'
                name={`engName_${index}`}
                placeholder='eng'
                value={row.engName}
                onChange={e => handleInputChange(index, 'engName', e.target.value)}
              />
            </td>
            <td>
              <input className='credits border border-solid border-black'
                required
                type='text'
                name={`credits_${index}`}
                placeholder='credit'
                value={row.credits}
                onChange={e => handleInputChange(index, 'credits', e.target.value)}
              />
            </td>
            <td>
              <select className='courseType border border-solid border-black'
                name={`courseType_${index}`}
                value={row.courseType}
                onChange={e => handleInputChange(index, 'courseType', e.target.value)}
              >
                {courseTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={() => handleDeleteRow(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <button className='left-[90%] mt-5 bg-blue-500 border border-solid border-black rounded-full px-3 py-1 hover:bg-blue-400 absolute'
      id='btnSubmit'
      type='submit'
      disabled={rows.length === 0}
      onClick={btnSubmit}>
      Submit
    </button>
  </form>
);

const BtnAddDelete = ({ addRow }) => (
  <div className='mt-5'>
    <button className='bg-green-500 border border-solid border-black rounded-full px-3 py-1 hover:bg-green-200'
      onClick={addRow}>
      Add row
    </button>
  </div>
);

const BtnCloseMenu = ({ closeManual }) => (
  <div className='mb-5'>
    <button onClick={closeManual}>Back</button>
  </div>
);

export default function Manualimport({ yearOptions, handleManualLoad }) {
  const [rows, setRows] = useState([initialRowState]);

  const handleInputChange = (index, key, value) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
  };
  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    if (rows.length == 0) {
      document.getElementById('btnSubmit').disabled = true;
    }
  };

  const addRow = () => {
    if (rows.length < 5) {
      setRows([
        ...rows,
        {
          courseCode: '',
          curriculum: '',
          thName: '',
          engName: '',
          credits: '',
          courseType: '',
        },
      ]);
    } else {
      alert('เพิ่มได้สูงสุด 5 วิชา/ครั้ง');
    }
  };
  const closeManual = () => {
    let menu = document.getElementById('manualImport');
    menu.classList.toggle('invisible');
  };
  const btnSubmit = (e) => {
    e.preventDefault();

    let courseData = [];

    document.querySelectorAll('.courseCode').forEach((el, index) => {
      const course_code = el.value;
      const curriculum = document.querySelectorAll('.curriculum')[index].value;
      const th_name = document.querySelectorAll('.thName')[index].value;
      const eng_name = document.querySelectorAll('.engName')[index].value;
      const credit = document.querySelectorAll('.credits')[index].value;
      const course_type = document.querySelectorAll('.courseType')[index].value;

      if (!course_code || !curriculum || !th_name || !eng_name || !credit || !course_type) {
        alert('Please fill in all fields');
        return; // Exit early if any field is empty
      }

      // Create object and push into courseData array
      courseData.push({
        course_code,
        curriculum,
        th_name,
        eng_name,
        credit,
        course_type
      });
    });

    if (courseData.length !== document.querySelectorAll('.courseCode').length) {
      return;
    }
    console.log('Data to be saved:', courseData);
    handleManualLoad(courseData);
  };

  return (
    <div className='flex flex-col bg-black/50 top-0 left-0 absolute w-full min-h-dvh text-white justify-center items-center invisible'
      id='manualImport'
    >
      <div className='relative p-5 bg-white/100 text-black w-2/3 overflow-auto'>
        <BtnCloseMenu closeManual={closeManual} />
        <ManualTableImport
          yearOptions={yearOptions}
          rows={rows}
          handleInputChange={handleInputChange}
          handleDeleteRow={handleDeleteRow}
          btnSubmit={btnSubmit}
        />
        <BtnAddDelete addRow={addRow} />
      </div>
    </div>
  );
}