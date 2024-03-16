import React from 'react';
import { useBranchesContext, useProfsContext } from '../../context/Prof-Context';
import { useGetLabRoomByBranch } from '../../api/Profs_API';

const HeaderSelect = ({ selectName, options = [], value, handleChange, colStart }) => (
    <div className={`relative ${colStart} flex`}>
        <select
            className='px-8 py-2 border rounded-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 focus:outline-none focus:border-asparagus focus:ring focus:ring-asparagus/50'
            value={value}
            onChange={e => handleChange(e.target.value)}
        >
            {selectName && <option value=''>Select {selectName}</option>}
            {options.map(option => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const MemoizedHeaderSelect = React.memo(HeaderSelect);

export default function HeaderContent({ currentPage, currentBranch, handleBranchChange, currentYear, handleYearChange, currentProfName, handleProfChange, profRole, currentLab, handleLabChange }) {
    const { branches } = useBranchesContext();
    const { profsBranchTag } = useProfsContext();
    const { data: labRoomData } = useGetLabRoomByBranch(currentBranch);

    return (
        <>
            {branches && (
                <MemoizedHeaderSelect
                    options={branches.map(branch => ({ value: branch.branch_tag, label: branch.branch_tag, disabled: profRole === 'prof' }))}
                    value={currentBranch}
                    handleChange={handleBranchChange}
                    colStart='col-start-3'
                />
            )}

            {(currentPage === 'Home' || currentPage === 'Prof') && (
                <MemoizedHeaderSelect selectName='year'
                    options={Array.from({ length: 4 }, (_, i) => ({ value: `${currentBranch}/${i + 1}`, label: `${currentBranch}/${i + 1}`, disabled: false }))}
                    value={currentYear}
                    handleChange={handleYearChange}
                    colStart='col-start-5'
                />
            )}
            {currentPage === 'Prof' && profsBranchTag && (
                <MemoizedHeaderSelect selectName='prof'
                    options={profsBranchTag.map(prof => ({ value: prof.name, label: prof.name, disabled: false }))}
                    value={currentProfName}
                    handleChange={handleProfChange}
                    colStart='col-start-7'
                />
            )}
            {currentPage === 'Lab' && (
                <MemoizedHeaderSelect selectName='lab'
                    options={labRoomData && labRoomData.map(lab => ({ value: lab, label: lab, disabled: false }))}
                    value={currentLab}
                    handleChange={handleLabChange}
                    colStart='col-start-5'
                />
            )}
        </>
    );
}