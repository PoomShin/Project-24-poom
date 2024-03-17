import React from 'react';
import { IconData } from '../data/IconData';
import { useBranchesContext, useProfsContext } from '../../context/Prof-Context';
import { useGetLabRoomByBranch } from '../../api/Profs_API';

const HeaderSelect = ({ colStart, defaultSelect, options = [], value, handleChange }) => (
    <div className={`relative ${colStart} flex`}>
        <select
            className='px-8 py-2 border rounded-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 focus:outline-none focus:border-asparagus focus:ring focus:ring-asparagus/50'
            value={value}
            onChange={e => handleChange(e.target.value)}
        >
            {defaultSelect && <option value=''>{defaultSelect}</option>}
            {options.map(option => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const MemoizedHeaderSelect = React.memo(HeaderSelect);

export default function ContentProfHeader({
    currentPage,
    currentBranch, handleBranchChange,
    currentYear, handleYearChange,
    currentProfName, handleProfChange, profRole,
    currentLab, handleLabChange
}) {
    const icon = IconData[currentPage];

    const { branches } = useBranchesContext();
    const { profsBranchTag } = useProfsContext();
    const { data: labRoomData } = useGetLabRoomByBranch(currentBranch);

    return (
        <div className='overflow-auto grid grid-cols-10 items-center bg-light_blue p-4'>
            <div className='flex gap-2 items-center col-start-1'>
                <img src={icon} className='h-10' />
                <p className='text-3xl font-semibold text-teal-950'>{currentPage}</p>
            </div>

            {branches && (
                <MemoizedHeaderSelect colStart='col-start-3'
                    options={branches.map(branch => ({ value: branch.branch_tag, label: branch.branch_tag, disabled: profRole === 'prof' }))}
                    value={currentBranch}
                    handleChange={handleBranchChange}
                />
            )}
            {(currentPage === 'Home' || currentPage === 'Prof') && (
                <MemoizedHeaderSelect colStart='col-start-5'
                    selectName='select year'
                    options={Array.from({ length: 4 }, (_, i) => ({ value: `${currentBranch}/${i + 1}`, label: `${currentBranch}/${i + 1}`, disabled: false }))}
                    value={currentYear}
                    handleChange={handleYearChange}
                />
            )}
            {currentPage === 'Prof' && profsBranchTag && (
                <MemoizedHeaderSelect colStart='col-start-7'
                    selectName='select prof'
                    options={profsBranchTag.map(prof => ({ value: prof.name, label: prof.name, disabled: false }))}
                    value={currentProfName}
                    handleChange={handleProfChange}
                />
            )}
            {currentPage === 'Lab' && (
                <MemoizedHeaderSelect colStart='col-start-5'
                    selectName='select lab'
                    options={labRoomData && labRoomData.map(lab => ({ value: lab, label: lab, disabled: false }))}
                    value={currentLab}
                    handleChange={handleLabChange}
                />
            )}
        </div>
    )
}