export default function SectionItem({ group, quantity, unit, hours, day, start, end, professor, branch }) {
    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>

            <div className='flex self-center text-xs text-white'>
                <span className='ml-4 mr-2'>หมู่: </span>
                <span className="mr-2">จำนวน: </span>
                <input type='text' className='text-black border rounded-sm mr-2 p-1 w-10 h-5' />
                <span className="mr-2">หน่วย: </span>
                <input type='text' className='text-black border rounded-sm mr-2 p-1 w-5 h-5' />
                <span className="mr-2">ชั่วโมง: </span>
                <input type="text" className='text-black border rounded-sm mr-2 p-1 w-5 h-5' />
            </div>

            <div className='flex self-center text-xs text-white mt-3'>
                <span className='ml-4 mr-2'>วัน: </span>
                <input type='text' className='text-black border rounded-sm mr-2 p-1 w-12 h-5' />
                <span className='mr-2'>เริ่ม: </span>
                <input type='text' className='text-black border rounded-sm mr-2 p-1 w-12 h-5' />
                <span className='mr-2'>สิ้นสุด: </span>
                <input type='text' className='text-black border rounded-sm mr-2 p-1 w-12 h-5' />
            </div>

            <div className='flex flex-col self-center text-xs text-white mt-3'>
                <div>
                    <span className='ml-4 mr-1'>อาจารย์: </span>
                    <input type='text' className='text-black border rounded-sm mr-2 p-1 w-60 h-5' />
                </div>
                <div className='mt-4'>
                    <span className='ml-4 mr-4'>สาขา: </span>
                    <input type='text' className='text-black border rounded-sm mr-2 p-1 w-60 h-5' />
                </div>
            </div>
        </div>
    );
}