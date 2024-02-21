import { useState, useMemo, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import { useUserContext } from '../context/User-Context';
import { AdminProvider } from '../context/Admin-Context';

export default function Admin() {
  const { userContextValues, setUserContextValues } = useUserContext();
  const [branchTag, setBranchTag] = useState(null);
  const [page, setPage] = useState(localStorage.getItem('currentPage') || 'Branch');

  const { name } = userContextValues;

  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);

  useEffect(() => {
    localStorage.setItem('currentPage', page);     // Save the currentPage value to localStorage whenever it changes
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
