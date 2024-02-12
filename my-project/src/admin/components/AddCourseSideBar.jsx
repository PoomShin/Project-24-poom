export default function AddCourseSideBar({ options, courseTag, selectedCurriculum, handleCurriculumChange, handleImport, onClose }) {
    return (
        <div className='w-64 flex flex-col items-center rounded-lg bg-slate-200 p-4'>
            <h1 className='text-xl mb-4'>Add Course</h1>
            <div>
                <h2 className='text-lg'>course code filter</h2>
                <h2 className='border border-soild border-black shadow-sm shadow-black bg-white mt-1'>{courseTag}</h2>
            </div>

            <h2 className='text-lg mt-2'>curriculum</h2>
            <select className='border border-solid border-black shadow-sm shadow-black rounded-md mt-1 px-4 py-2'
                value={selectedCurriculum}
                onChange={handleCurriculumChange}
            >
                {options}
            </select>

            <button className="mt-4 px-6 py-2 rounded font-bold text-white bg-blue-500 hover:bg-blue-700" type='button'>
                Manual
            </button>
            <label className="mt-4 px-6 py-2 rounded text-white font-bold bg-green-500 hover:bg-green-700 cursor-pointer" htmlFor="file-upload">
                Import
                <input type="file" id="file-upload" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
            </label>

            <button className="bg-red-300 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 
        focus:ring-opacity-50 py-2 px-8 my-4 rounded-md text-white font-semibold shadow-md transition duration-300 ease-in-out"
                onClick={onClose}>
                Close
            </button>
        </div>
    );
}