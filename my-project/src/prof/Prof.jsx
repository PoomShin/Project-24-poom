import { useState, useMemo } from 'react';
import { useUserContext } from '../context/User-Context';
import { BranchProvider, CourseProvider, ProfsProvider, GroupProvider } from '../context/Prof-Context';
import NavbarProf from './layouts/NavbarProf';
import SideBarLeft from './layouts/SideBarLeft';
import ContentProf from './layouts/ContentProf';
import SideBarRight from './layouts/SideBarRight';

export default function Prof() {
    const { userContextValues } = useUserContext()
    const { name = '', role = '', branch_tag = '', imageUrl = '' } = userContextValues || {};

    const [currentPage, setCurrentPage] = useState('Home');

    const NavBarProfMemo = useMemo(() => <NavbarProf name={name} role={role} img={imageUrl} />, [name, role, imageUrl]);

    return (
        <BranchProvider>
            <CourseProvider name={name} branch_tag={branch_tag}>
                <ProfsProvider branch_tag={branch_tag}>
                    <GroupProvider ownerBranch={branch_tag}>
                        <div className='grid grid-cols-20'>
                            {NavBarProfMemo}
                            <SideBarLeft currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            <ContentProf currentPage={currentPage} userData={userContextValues} />
                            <SideBarRight />
                        </div>
                    </GroupProvider>
                </ProfsProvider>
            </CourseProvider>
        </BranchProvider>
    );
}