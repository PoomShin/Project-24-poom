import { useState, useMemo, useContext } from "react";
import { BranchProvider, CourseProvider } from "../context/Prof-Context";
import { UserContext } from "../context/User-Context";
import NavbarProf from "./NavbarProf";
import SideBarLeft from "./SideBarLeft";
import ContentProf from "./ContentProf";
import SideBarRight from "./SideBarRight";

export default function Prof() {
    const { userContextValues, setUserContextValues } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState('Home');
    const { name, role, branchtag, imageUrl } = userContextValues;

    const memoizedNavbar = useMemo(() => <NavbarProf name={name} role={role} img={imageUrl} />, [name, role, imageUrl]);

    return (
        <BranchProvider>
            <CourseProvider branchtag={branchtag}>
                <div className="grid grid-cols-12 w-full h-full">
                    {memoizedNavbar}
                    <SideBarLeft currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <ContentProf currentPage={currentPage} userData={userContextValues} />
                    <SideBarRight />
                </div>
            </CourseProvider>
        </BranchProvider>
    );
}
