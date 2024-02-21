import { useState, useMemo } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import { useUserContext } from '../context/User-Context';
import { AdminProvider } from '../context/Admin-Context';

export default function Admin() {
  const { userContextValues, setUserContextValues } = useUserContext();
  const [selectedBranchTag, setSelectedBranchTag] = useState(null);
  const [currentPage, setCurrentPage] = useState('Branch');

  const { name } = userContextValues;

  const memoizedNavbar = useMemo(() => <Navbar name={name} />, [name]);

  return (
    <AdminProvider selectedBranchTag={selectedBranchTag}>
      <div className='w-full h-full grid grid-cols-12'>
        {memoizedNavbar}
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <Content currentPage={currentPage} setCurrentPage={setCurrentPage} selectedBranchTag={selectedBranchTag} setSelectedBranchTag={setSelectedBranchTag} />
      </div>
    </AdminProvider>
  );
}
