import { useState, useMemo, useEffect } from 'react';
import { useUserContext } from '../context/User-Context';
import { AdminProvider } from '../context/Admin-Context';
import Navbar from './Layouts/Navbar';
import Sidebar from './Layouts/Sidebar';
import Content from './Layouts/Content';

export default function Admin() {
  const [name, setName] = useState(useUserContext().userContextValues.name);
  const [branchTag, setBranchTag] = useState(null);
  const [page, setPage] = useState(localStorage.getItem(true) || 'Branch');

  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);

  useEffect(() => {
    localStorage.setItem('currentPage', page);
  }, [page]);

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
