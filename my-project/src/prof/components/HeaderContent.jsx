import React from 'react';
import { useBranchesContext, useProfsContext } from '../../context/Prof-Context';

const HeaderSelect = ({ selectName, options = [], value, handleChange, colStart }) => (
    <div className={`relative ${colStart} flex`}>
        <select
            className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={value}
            onChange={e => handleChange(e.target.value)}
        >
            <option value=''>Select {selectName}</option>
            {options && options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const MemoizedHeaderSelect = React.memo(HeaderSelect);

export default function HeaderContent({ currentPage, currentBranch, handleBranchChange, currentYear, handleYearChange, currentProf, handleProfChange }) {
    const { branches } = useBranchesContext();
    const { profsBranchTag } = useProfsContext();

    return (
        <>
            {branches && (
                <MemoizedHeaderSelect selectName='branch'
                    options={branches.map(branch => ({ value: branch.branch_tag, label: branch.branch_tag }))}
                    value={currentBranch}
                    handleChange={handleBranchChange}
                    colStart='col-start-3'
                />
            )}

            {(currentPage === 'Home' || currentPage === 'Prof') && (
                <MemoizedHeaderSelect selectName='year'
                    options={Array.from({ length: 4 }, (_, i) => ({ value: `${currentBranch}/${i + 1}`, label: `${currentBranch}/${i + 1}` }))}
                    value={currentYear}
                    handleChange={handleYearChange}
                    colStart='col-start-5'
                />
            )}
            {currentPage === 'Prof' && profsBranchTag && (
                <MemoizedHeaderSelect selectName='prof'
                    options={profsBranchTag.map(prof => ({ value: prof.name, label: prof.name }))}
                    value={currentProf}
                    handleChange={handleProfChange}
                    colStart='col-start-7'
                />
            )}
            {currentPage === 'Lab' && (
                <MemoizedHeaderSelect selectName='lab'
                    options={[{ value: 'LabCom23', label: 'LabCom23' }]}
                    value={''}
                    handleChange={() => { }} //
                    colStart='col-start-5'
                />
            )}
        </>
    );
}