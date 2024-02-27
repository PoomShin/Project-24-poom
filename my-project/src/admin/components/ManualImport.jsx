import React, { useState } from "react";

const BtnCloseMenu = ({ closeManual }) => (
  <div className="mb-5">
    <button onClick={closeManual}>Back</button>
  </div>
);

const currentYear = new Date().getFullYear();

const generateYearOptions = () => {
  const options = [];
  for (
    let i = currentYear - 10 + 543 - 2000 - 500;
    i <= currentYear + 10 + 543 - 2000 - 500;
    i++
  ) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return options;
};

const TableImport = ({
  rows,
  handleInputChange,
  handleDeleteRow,
  btnSubmit,
}) => (
  <>
    <form action="" className="relative">
      <table
        id="tableID"
        className="w-full text-center border-2 border-solid border-black">
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
            <tr
              key={index}
              className="relative border border-solid border-black">
              <td>
                <input
                  required
                  type="number"
                  className="courseCode border border-solid border-black"
                  name={`courseCode_${index}`}
                  value={row.courseCode}
                  onChange={(e) =>
                    handleInputChange(index, "courseCode", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  className="curriculum border border-solid border-black"
                  name={`curriculum_${index}`}
                  value={row.curriculum}
                  onChange={(e) =>
                    handleInputChange(index, "curriculum", e.target.value)
                  }>
                  {generateYearOptions()}
                </select>
              </td>
              <td>
                <input
                  required
                  type="text"
                  className="thName border border-solid border-black"
                  name={`thName_${index}`}
                  value={row.thName}
                  onChange={(e) =>
                    handleInputChange(index, "thName", e.target.value)
                  }
                  placeholder="th"
                />
              </td>
              <td>
                <input
                  required
                  type="text"
                  className="engName border border-solid border-black"
                  name={`engName_${index}`}
                  value={row.engName}
                  onChange={(e) =>
                    handleInputChange(index, "engName", e.target.value)
                  }
                  placeholder="eng"
                />
              </td>
              <td>
                <input
                  required
                  type="text"
                  className="credits border border-solid border-black"
                  name={`credits_${index}`}
                  value={row.credits}
                  onChange={(e) =>
                    handleInputChange(index, "credits", e.target.value)
                  }
                  placeholder="credit"
                />
              </td>
              <td>
                <select
                  className="courseType border border-solid border-black"
                  name={`courseType_${index}`}
                  value={row.courseType}
                  onChange={(e) =>
                    handleInputChange(index, "courseType", e.target.value)
                  }>
                  <option value="เฉพาะทั่วไป">เฉพาะทั่วไป</option>
                  <option value="เฉพาะเลือก">เฉพาะเลือก</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="left-[90%] mt-5 bg-blue-500 border border-solid border-black rounded-full px-3 py-1 hover:bg-blue-400 absolute"
        id="btnSubmit"
        type="submit"
        disabled={rows.length === 0}
        onClick={btnSubmit}>
        Submit
      </button>
    </form>
  </>
);

const BtnAddDelete = ({ addRow }) => (
  <div className="mt-5">
    <button
      className="bg-green-500 border border-solid border-black rounded-full px-3 py-1 hover:bg-green-200"
      onClick={addRow}>
      Add row
    </button>
  </div>
);

function Manualimport() {
  const [rows, setRows] = useState([
    {
      courseCode: "",
      curriculum: "",
      thName: "",
      engName: "",
      credits: "",
      courseType: "",
    },
  ]);

  const handleInputChange = (index, key, value) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    if (rows.length == 0) {
      document.getElementById("btnSubmit").disabled = true;
    }
  };

  const addRow = () => {
    if (rows.length < 5) {
      setRows([
        ...rows,
        {
          courseCode: "",
          curriculum: "",
          thName: "",
          engName: "",
          credits: "",
          courseType: "",
        },
      ]);
    } else {
      alert("เพิ่มได้สูงสุด 5 วิชา/ครั้ง");
    }
  };

  const closeManual = () => {
    let menu = document.getElementById("manualImport");
    menu.classList.toggle("invisible");
  };

  const btnSubmit = (e) => {
    e.preventDefault();
    let codeArr = [];
    let curriculumArr = [];
    let thArr = [];
    let engArr = [];
    let creditsArr = [];
    let courseTypeArr = [];
    // read each class
    document.querySelectorAll(".courseCode").forEach(function (el) {
      codeArr.push(el.value);
    });
    document.querySelectorAll(".curriculum").forEach(function (el) {
      curriculumArr.push(el.value);
    });
    document.querySelectorAll(".thName").forEach(function (el) {
      thArr.push(el.value);
    });
    document.querySelectorAll(".engName").forEach(function (el) {
      engArr.push(el.value);
    });
    document.querySelectorAll(".credits").forEach(function (el) {
      creditsArr.push(el.value);
    });
    document.querySelectorAll(".courseType").forEach(function (el) {
      courseTypeArr.push(el.value);
    });
    // check null empty
    const code = codeArr.some((element) => element === "");
    const cu = curriculumArr.some((element) => element === "");
    const th = thArr.some((element) => element === "");
    const eng = engArr.some((element) => element === "");
    const cr = creditsArr.some((element) => element === "");
    const cou = courseTypeArr.some((element) => element === "");
    if (code || cu || th || eng || cr || cou) {
      // มี null reset ค่าใน array
      codeArr = [];
      curriculumArr = [];
      thArr = [];
      engArr = [];
      creditsArr = [];
      courseTypeArr = [];
      alert("โปรดใส่ข้อมูล");
    } else {
      console.log("บันทึกข้อมูล");
      // loop array ไปใส่ database
      // array size จะเท่ากันหมด
    }
    // test log
    console.log(codeArr);
    console.log(curriculumArr);
    console.log(thArr);
    console.log(engArr);
    console.log(creditsArr);
    console.log(courseTypeArr);
  };

  return (
    <div
      id="manualImport"
      className="flex flex-col bg-black/50 top-0 left-0 absolute w-full min-h-dvh text-white justify-center items-center">
      <div className="relative p-5 bg-white/100 text-black w-2/3 overflow-auto">
        <BtnCloseMenu closeManual={closeManual} />
        <TableImport
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

export default Manualimport;
