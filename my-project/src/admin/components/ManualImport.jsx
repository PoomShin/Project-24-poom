import React from "react";
import { useState } from "react";

const BtnCloseMenu = () => (
  <div id="manualImport">
    <button onClick={closeManual}>Back</button>
  </div>
);

const TableImport = () => (
  <table className="">
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
      <tr>
        <td>
          <input type="number" name="" id="" />
        </td>
        <td>
          <select name="" id="">
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </select>
        </td>
        <td>
          <input type="text" name="" id="" placeholder="th" />
        </td>
        <td>
          <input type="text" name="" id="" placeholder="eng" />
        </td>
        <td>
          <input type="text" name="" id="" placeholder="credit" />
        </td>
        <td>
          <select name="" id="">
            <option value="เฉพาะทั่วไป">เฉพาะทั่วไป</option>
            <option value="เฉพาะเลือก">เฉพาะเลือก</option>
          </select>
        </td>
        <td>
          <button>Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
);

function closeManual() {
  let memu = document.getElementById("manualImport");
  memu.classList.toggle("invisible");
}

function Manualimport() {
  return (
    <>
      <div
        id="manualImport"
        className=" flex flex-col  bg-black/50 top-0 left-0 absolute w-full min-h-dvh text-white justify-center items-center ">
        <div className="flex flex-col p-5  bg-white/100 text-black text-center w-2/3 overflow-auto">
          <BtnCloseMenu />
          <TableImport />
        </div>
      </div>
    </>
  );
}

export default Manualimport;
