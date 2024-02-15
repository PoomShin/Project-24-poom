export default function Prof_Layout() {
    const { name } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState('Home');

    const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);
    
    return (
        <div className="grid grid-cols-12 w-full h-full ">
            {memoizedNavbar}
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} /> 
            <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <Sideright currentPage={currentPage} setCurrentPage={setCurrentPage} /> 
        </div>
      );
}

import { useContext, useState, useMemo } from "react";
import Navbar from "./Navbarpro";
import Sidebar from "./Sidebarpro";
import Content from "./Contentpro";
import Sideright from "./Right";
import { UserContext } from "../../public/context/user-context";
