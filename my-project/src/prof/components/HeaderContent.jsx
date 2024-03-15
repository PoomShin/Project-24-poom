import React from 'react';
import { useBranchesContext, useProfsContext } from '../../context/Prof-Context';

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

export default function HeaderContent({ currentPage, currentBranch, handleBranchChange, currentYear, handleYearChange, currentProf, handleProfChange, profRole }) {
    const { branches } = useBranchesContext();
    const { profsBranchTag } = useProfsContext();

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
                    value={currentProf}
                    handleChange={handleProfChange}
                    colStart='col-start-7'
                />
            )}
            {currentPage === 'Lab' && (
                <MemoizedHeaderSelect selectName='lab'
                    options={[{ value: 'LabCom23', label: 'LabCom23', disabled: false }]}
                    value={''}
                    handleChange={() => { }} //
                    colStart='col-start-5'
                />
            )}
        </>
    );
}