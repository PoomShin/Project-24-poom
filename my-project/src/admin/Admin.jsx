export default function Admin() {
  const { name } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState('Branch');

  // Memoize the Navbar component to avoid unnecessary re-renders
  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);

  return (
    <div className="grid grid-cols-12 w-full h-full ">
      {memoizedNavbar}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

import { useContext, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { UserContext } from "../../public/context/user-context";
