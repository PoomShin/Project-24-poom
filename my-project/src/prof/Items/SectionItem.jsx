import { useState } from 'react';
import plusIcon from '../../assets/plus.png';

export default function SectionItems({ onAddSection }) {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleShowForm = () => {
        setIsFormVisible(true);
    };

    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
            {isFormVisible ? (
                <form>
                    <div className='absolute top-0 right-0 flex text-xs text-white mt-2 mr-2'>
                        <button
                            onClick={null}
                            className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1'
                        >
                            Add
                        </button>
                        <button
                            onClick={null}
                            className='bg-red-500 hover:bg-red-700  rounded px-2 py-1'
                        >
                            Cancle
                        </button>
                    </div>
                    <div className='flex self-center text-xs text-white'>
                        <span className='ml-4 mr-1'>หมู่</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-10 h-5" />
                        <span className="mr-2">จำนวน</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-10 h-5" />
                        <span className="mr-2">หน่วย</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-5 h-5" />
                        <span className="mr-2">ชั่วโมง</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-5 h-5" />
                    </div>
                    <div className='flex self-center text-xs text-white mt-2'>
                        <span className='ml-4 mr-1'>วัน</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-10 h-5" />
                        <span className="mr-2">เริ่ม</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-10 h-5" />
                        <span className="mr-2">สิ้นสุด</span>
                        <input type="text" className="text-black border rounded-sm mr-2 p-1 w-10 h-5" />
                    </div>
                </form>
            ) : <img src={plusIcon} alt='Add Section' className='h-24 self-center' onClick={handleShowForm} />}
        </div>
    );
}
