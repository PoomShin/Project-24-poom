import { useState, useMemo, useContext } from "react";
import { UserContext } from "../context/User-Context";
import { BranchProvider } from "../context/Branch-Context";
import NavbarProf from "./NavbarProf";
import SideBarLeft from "./SideBarLeft";
import ContentProf from "./ContentProf";
import SideBarRight from "./SideBarRight";

export default function Prof() {
    const { userContextValues, setUserContextValues } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState('Home');
    const { name, role } = userContextValues;

    const memoizedNavbar = useMemo(() => <NavbarProf name={name} role={role} />, [name, role]);

    return (
        <BranchProvider>
            <div className="grid grid-cols-12 w-full h-full">
                {memoizedNavbar}
                <SideBarLeft currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <ContentProf currentPage={currentPage} userData={userContextValues} />
                <SideBarRight />
            </div>
        </BranchProvider>
    );
}
