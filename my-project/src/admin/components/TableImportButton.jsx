export default function TableImportButton({ handleImportDatabase }) {
    return (
        <div className='flex justify-center my-4'>
            <button className='font-bold text-white rounded bg-green-500 hover:bg-green-700 py-2 px-6 ' onClick={handleImportDatabase}>
                Import to Database
            </button>
        </div>
    );
}