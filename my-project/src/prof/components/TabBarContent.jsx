export default function TabBarContent({ currentPage, currentBranch, handleBranchChange, branches, currentYear, handleYearChange }) {
    return (
        <>
            {currentPage === 'Home' && (
                <>
                    <SelectBranch currentBranch={currentBranch} handleBranchChange={handleBranchChange} branches={branches} />
                    <SelectBranchWithYear currentYear={currentYear} currentBranch={currentBranch} handleYearChange={handleYearChange} />
                </>
            )}

            {currentPage === 'Prof' && (
                <>
                    <SelectBranch  currentBranch={currentBranch} handleBranchChange={handleBranchChange} branches={branches} />
                    <div className='relative col-start-4 flex'>
                        <SelectBranchWithYear currentYear={currentYear} currentBranch={currentBranch} handleYearChange={handleYearChange}/>
                    </div>   
                    <SelectPro/>
                </>
            )}

            {currentPage === 'Lab' && (
                <>
                    <SelectBranch currentBranch={currentBranch} handleBranchChange={handleBranchChange} branches={branches} />
                    <SelectLab/>
                </>
            )}
        </>
    );
}
const SelectBranch = ({ currentBranch, handleBranchChange, branches }) => (
    <div className='relative col-start-3 flex'>
        <select
            className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={currentBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
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
        <select
            className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            value={currentYear}
            onChange={(e) => handleYearChange(e.target.value)}
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

const SelectLab = () => (
    <div className='relative col-start-5 flex'>
        <select
            className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
        >
            <option value=''>Select Lab</option>
            <option value=''>LabCom23</option>
        </select>
    </div>
);

const SelectPro = () => (
    <div className='relative col-start-5 flex px-[15%]'>
        <select
            className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
        >
            <option value=''>Select Prof</option>
            <option value=''>วัชรพัฐ เมตตานันท</option>
        </select>
    </div>
);
