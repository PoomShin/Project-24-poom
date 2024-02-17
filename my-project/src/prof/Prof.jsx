import { useState, useMemo, useContext } from "react";
import { UserContext } from "../context/User-Context";
import Navbar from "./Navbarpro";
import SideBarLeft from "./SideBarLeft";
import Content from "./Contentpro";
import SideBarRight from "./SideBarRight";

export default function Prof() {
    const { userContextValues, setUserContextValues } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState('Home');
    const { name, role } = userContextValues;

    const memoizedNavbar = useMemo(() => <Navbar name={name} role={role} />, [name, role]);

    return (
        <div className="grid grid-cols-12 w-full h-full">
            {memoizedNavbar}
            <SideBarLeft currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <SideBarRight />
        </div>
    );
}
