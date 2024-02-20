import { useState } from 'react';
import plusIcon from '../../assets/plus.png';

export default function SectionAdd({ onAddSection }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        group: '',
        quantity: '',
        unit: '',
        hours: '',
        day: '',
        start: '',
        end: '',
        prof: '',
        branchtag: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleShowForm = () => {
        setIsFormVisible(s => !s);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddSection(formData);
        // Reset form data
        setFormData({
            group: '',
            quantity: '',
            unit: '',
            hours: '',
            days: '',
            start: '',
            end: '',
            prof: '',
            branchtag: ''
        });
        handleShowForm();
    };

    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
            {isFormVisible ? (
                <form onSubmit={handleSubmit}>
                    <div className='absolute top-0 right-0 flex text-xs text-white mt-2 mr-2'>
                        <button className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1'
                            type='submit'
                        >
                            Add
                        </button>
                        <button className='bg-red-500 hover:bg-red-700  rounded px-2 py-1'
                            type='button'
                            onClick={handleShowForm}
                        >
                            Cancle
                        </button>
                    </div>

                    <div className='flex self-center text-xs text-white'>
                        <InputSpan spanText='หมู่' spanClass={'ml-4 mr-2'} inputClass={'w-10 h-5'}
                            name='group'
                            value={formData.group}
                            onChange={handleInputChange}
                        />
                        <InputSpan spanText='จำนวน' spanClass={'mr-2'} inputClass={'w-10 h-5'}
                            name='quantity'
                            value={formData.quantity}
                            onChange={handleInputChange}
                        />
                        <InputSpan spanText='หน่วย' spanClass={'mr-2'} inputClass={'w-5 h-5'}
                            name='unit'
                            value={formData.unit}
                            onChange={handleInputChange}
                        />
                        <InputSpan spanText='ชั่วโมง' spanClass={'mr-2'} inputClass={'w-5 h-5'}
                            name='hours'
                            value={formData.hours}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex self-center text-xs text-white mt-3'>
                        <InputSpan spanText={'วัน'} spanClass={'ml-4 mr-2'} inputClass={'w-12 h-5'}
                            name='day'
                            value={formData.day}
                            onChange={handleInputChange}
                        />
                        <InputSpan spanText={'เริ่ม'} spanClass={'mr-2'} inputClass={'w-12 h-5'}
                            name='start'
                            value={formData.start}
                            onChange={handleInputChange}

                        />
                        <InputSpan spanText={'สิ้นสุด'} spanClass={'mr-2'} inputClass={'w-12 h-5'}
                            name='end'
                            value={formData.end}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex flex-col self-center text-xs text-white mt-3'>
                        <div>
                            <InputSpan spanText={'อาจารย์'} spanClass={'ml-4 mr-1'} inputClass={' w-60 h-5'}
                                name='prof'
                                value={formData.prof}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='mt-4'>
                            <InputSpan spanText={'สาขา'} spanClass={'ml-4 mr-4'} inputClass={'w-60 h-5'}
                                name='branchtag'
                                value={formData.branchtag}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </form>
            ) : <img src={plusIcon} alt='Add Section' className='h-24 self-center' onClick={handleShowForm} />}
        </div>
    );
}

const InputSpan = ({ spanText, spanClass, inputClass, name, value, onChange }) => {
    return (
        <>
            <span className={spanClass}>{spanText}</span>
            <input className={`text-black border rounded-sm mr-2 p-1 ${inputClass}`}
                type='text'
                required
                name={name}
                value={value}
                onChange={onChange}
            />
        </>
    )
}
