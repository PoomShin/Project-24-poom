import { useContext, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { UserContext } from "../context/User-Context";

export default function Admin() {
  const { userContextValues, setUserContextValues } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState('Branch');
  const { name } = userContextValues;

  // Memoize the Navbar component to avoid unnecessary re-renders
  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);
  
  return (
    <div className='grid grid-cols-12 w-full h-full'>
      <Navbar name={name} />
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
