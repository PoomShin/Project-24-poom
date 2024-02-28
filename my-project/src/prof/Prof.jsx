import { useState, useMemo } from "react";
import { BranchProvider, CourseProvider, ProfsProvider } from "../context/Prof-Context";
import { useUserContext } from "../context/User-Context";
import NavbarProf from "./layouts/NavbarProf";
import SideBarLeft from "./layouts/SideBarLeft";
import ContentProf from "./layouts/ContentProf";
import SideBarRight from "./layouts/SideBarRight";

export default function Prof() {
    const { userContextValues, setUserContextValues } = useUserContext()
    const [currentPage, setCurrentPage] = useState('Home');
    const { name, role, branch_tag, imageUrl } = userContextValues;

    const NavBarProfMemo = useMemo(() => <NavbarProf name={name} role={role} img={imageUrl} />, [name, role, imageUrl]);

    return (
        <BranchProvider>
            <CourseProvider branch_tag={branch_tag}>
                <ProfsProvider branch_tag={branch_tag}>
                    <div className='grid grid-cols-12 w-full h-full'>
                        {NavBarProfMemo}
                        <SideBarLeft currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <ContentProf currentPage={currentPage} userData={userContextValues} />
                        <SideBarRight />
                    </div>
                </ProfsProvider>
            </CourseProvider>
        </BranchProvider>
    );
}
