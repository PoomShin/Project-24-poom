import React, { useMemo } from 'react';
import { useBranchesContext, useProfsContext } from '../../context/Prof-Context';
import { useGetLabRoomByBranch } from '../../api/Profs_API';
import { IconData } from '../data/IconData';

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

export default function ContentProfHeader({ page, sharedState, onBranchChange, onBranchYearChange, onProfChange, onLabRoomChange }) {
    const icon = IconData[page];
    const { currentBranch, currentBranchYear, currentProfName, currentProfRole, currentLabRoom } = sharedState;

    const { branches = [] } = useBranchesContext();
    const { profsBranch = [] } = useProfsContext();
    const { data: labRoomData = [] } = useGetLabRoomByBranch(currentBranch);

    const yearOptions = useMemo(() => (
        Array.from({ length: 4 }, (_, i) => ({ value: `${currentBranch}/${i + 1}`, label: `${currentBranch}/${i + 1}`, disabled: false }))
    ), [currentBranch]);

    return (
        <div className='overflow-auto grid grid-cols-10 items-center bg-light_blue p-4'>
            <div className='flex gap-2 items-center col-start-1'>
                <img src={icon} className='h-10' alt='' />
                <p className='text-3xl font-semibold text-teal-950'>{page}</p>
            </div>

            <MemoizedHeaderSelect
                colStart='col-start-3'
                options={branches.map(branch => ({ value: branch.branch_tag, label: branch.branch_tag, disabled: currentProfRole === 'prof' }))}
                value={currentBranch}
                handleChange={onBranchChange}
            />

            {(page === 'Home' || page === 'Prof') && (
                <MemoizedHeaderSelect
                    colStart='col-start-5'
                    defaultSelect='select year'
                    options={yearOptions}
                    value={currentBranchYear}
                    handleChange={onBranchYearChange}
                />
            )}
            {page === 'Prof' ? (
                <MemoizedHeaderSelect
                    colStart='col-start-7'
                    defaultSelect='select prof'
                    options={profsBranch.map(prof => ({ value: prof.name, label: prof.name, disabled: false }))}
                    value={currentProfName}
                    handleChange={onProfChange}
                />
            ) : (
                page === 'Lab' && (
                    <MemoizedHeaderSelect
                        colStart='col-start-5'
                        defaultSelect='select lab'
                        options={labRoomData.map(lab => ({ value: lab, label: lab, disabled: false }))}
                        value={currentLabRoom}
                        handleChange={onLabRoomChange}
                    />
                )
            )}
        </div>
    );
}