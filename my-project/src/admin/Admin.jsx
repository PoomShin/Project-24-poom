import { useState, useMemo } from 'react';
import { useUserContext } from '../context/User-Context';
import { AdminProvider } from '../context/Admin-Context';
import Navbar from './Layouts/Navbar';
import Sidebar from './Layouts/Sidebar';
import Content from './Layouts/Content';

export default function Admin() {
  const { name } = useUserContext().userContextValues || {};

  const [page, setPage] = useState('Branch');
  const [branchTag, setBranchTag] = useState(null);

  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);

  return (
    <AdminProvider selectedBranchTag={branchTag}>
      <div className='w-full h-full grid grid-cols-12'>
        {memoizedNavbar}
        <Sidebar currentPage={page} setCurrentPage={setPage} />
        <Content currentPage={page} setCurrentPage={setPage} selectedBranchTag={branchTag} setSelectedBranchTag={setBranchTag} />
      </div>
    </AdminProvider>
  );
}