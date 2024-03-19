export default function ProfGroupContextMenu({ position, onClose }) {
    const { x, y } = position;

    return (
        <div className='sticky bg-slate-800 border border-slate-700 rounded-sm shadow-md text-sm text-white mx-2'
            style={{ top: y + 10, left: x, }}
        >
            <div className='p-1 flex flex-col items-center'>
                <button className='block w-full py-2 px-4 text-left hover:bg-gray-700'>Edit Group</button>
                <button className='block w-full py-2 px-4 text-left hover:bg-gray-700'>Delete Group</button>
                <button className='absolute top-0 right-0 mt-1 mr-1 text-white' onClick={onClose}>X</button>
            </div>
        </div>
    );
}