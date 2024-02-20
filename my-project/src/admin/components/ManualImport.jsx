import React from "react";
import { useState } from "react";

function Manualimport() {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const toggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const addRow = () => {
    const newRow = {
      courseCode: "",
      curriculum: "",
      thName: "",
      enName: "",
      credits: "",
      courseType: "",
    };
    setRowCount(rowCount + 1);
    setRows([...rows, newRow]);
  };

  const deleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRowCount(rowCount - 1);
    setRows(updatedRows);
  };

  console.log();

  function closeManual() {
    let memu = document.getElementById("manualImport");
    memu.classList.add("invisible");
  }
  /*function btnC() {
    // Access all elements with the class 'code'
    const inputs = document.querySelectorAll('.code');   
    // Create an array to store the values
    const values = [];   
    // Loop through each input element
    inputs.forEach(input => {
        // Push the value of each input to the 'values' array
        values.push(input.value);
    });
    
    console.log(values); // Output the array of values
    <button onClick={btnC}>submit</button>
    
  }*/

  return (
    <div
      id="manualImport"
      className="absolute top-0 left-0 w-full min-h-dvh flex flex-col bg-white invisible">
      <button onClick={closeManual}>Back</button>

      <br />

      <br />
      <button onClick={toggleTable}>
        {isTableVisible ? "Hide Table" : "Show Table"}
      </button>
      {isTableVisible && (
        <div
          id="table-container"
          style={{
            backgroundColor: "lightgray",
            padding: "10px",
            marginTop: "10px",
          }}>
          <form action="">
            <table className="table-auto">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    course code
                  </th>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    curriculum
                  </th>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    th-name
                  </th>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    en-name
                  </th>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    credits
                  </th>
                  <th style={{ backgroundColor: "green", color: "white" }}>
                    course type
                  </th>
                </tr>
              </thead>
              <tbody id="table-body">
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        class="code"
                        placeholder="0360xxxx"
                        type="text"
                        maxLength="8"
                        pattern="\d{8}"
                        size="10"
                      />
                    </td>
                    <td>
                      <select className="curriculum">
                        {Array.from({ length: 100 }, (_, index) => {
                          const value = index.toString().padStart(2, "0");
                          return (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input class="th-name" type="text" size="60" />
                    </td>
                    <td>
                      <input class="en-name" type="text" size="60" />
                    </td>
                    <td>
                      <select className="credits">
                        {Array.from({ length: 4 }, (_, index) => {
                          const value = (index + 1).toString();
                          return (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <select className="type">
                        <option value="เฉพาะบังคับ">เฉพาะบังคับ</option>
                        <option value="เฉพาะเลือก">เฉพาะเลือก</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        style={{ backgroundColor: "red", color: "black" }}
                        onClick={() => deleteRow(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          <button
            style={{
              backgroundColor: "lime",
              color: "black",
              marginRight: "5px",
            }}
            onClick={addRow}
            disabled={rowCount === 5 ? true : false}>
            Add Row
          </button>
          <button style={{ backgroundColor: "lime", color: "black" }}>
            submit
          </button>
        </div>
      )}
    </div>
  );
}

export default Manualimport;
