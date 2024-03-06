import { useBranchesContext, useProfsContext } from "../../context/Prof-Context";

export default function HeaderContent({
    currentPage,
    currentBranch, handleBranchChange,
    currentYear, handleYearChange,
    currentProfName, handleProfChange,
}) {
    const { branches } = useBranchesContext();
    const { profsBranchTag } = useProfsContext();

    return (
        <>
            <SelectBranch branches={branches} currentBranch={currentBranch} handleBranchChange={handleBranchChange} />

            {(currentPage === 'Home' || currentPage === 'Prof') && (
                <SelectBranchWithYear currentYear={currentYear} currentBranch={currentBranch} handleYearChange={handleYearChange} />
            )}
            {currentPage === 'Prof' && <SelectProf profs={profsBranchTag} curProf={currentProfName} handleProfChange={handleProfChange} />}
            {currentPage === 'Lab' && <SelectLab />}
        </>
    );
}

const SelectBranch = ({ branches, currentBranch, handleBranchChange }) => (
    <div className='relative col-start-3 flex'>
        <select className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={currentBranch}
            onChange={e => handleBranchChange(e.target.value)}
        >
            {branches && branches.map((branch) => (
                <option key={branch.branch_tag} value={branch.branch_tag}>
                    {branch.branch_tag}
                </option>
            ))}
        </select>
    </div>
);

const SelectBranchWithYear = ({ currentYear, currentBranch, handleYearChange }) => (
    <div className='relative col-start-5 flex'>
        <select className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={currentYear}
            onChange={e => handleYearChange(e.target.value)}
        >
            <option value=''>Select Year</option>
            {Array.from({ length: 4 }, (_, i) => (
                <option key={i + 1} value={`${currentBranch}/${i + 1}`}>
                    {`${currentBranch}/${i + 1}`}
                </option>
            ))}
        </select>
    </div>
);

const SelectProf = ({ profs, curProf, handleProfChange }) => (
    <div className='relative col-start-7 flex px-[15%]'>
        <select className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={curProf}
            onChange={e => handleProfChange(e.target.value)}
        >
            <option value=''>Select Prof</option>
            {profs && profs.map((prof) => (
                <option key={prof.id} value={prof.name}>
                    {prof.name}
                </option>
            ))}
        </select>
    </div>
);

const SelectLab = ({ curLab, handleLabChange }) => (
    <div className='relative col-start-5 flex'>
        <select className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'

        >
            <option value=''>Select Lab</option>
            <option value=''>LabCom23</option>
        </select>
    </div>
);
