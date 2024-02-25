import { useState } from 'react';
import { useProfsContext, useBranchesContext } from '../../context/Prof-Context';
import plusIcon from '../../assets/plus.png';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 20 && minute > 0) {
                break; // Break the loop if the hour exceeds 20:00
            }
            const formattedMinute = minute === 0 ? '00' : minute;
            options.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return options;
};
const timeOptions = generateTimeOptions();

export default function AddGroup({ onAddSection, isLab }) {
    const { profs } = useProfsContext();
    const { branch_year } = useBranchesContext();
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [formData, setFormData] = useState({
        group_num: '',
        quantity: '',
        unit: '',
        hours: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        prof_name: [],
        branch_year: [],
        lab_room: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleShowForm = () => {
        setIsFormVisible(prevState => !prevState);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddSection(formData);
        e.target.reset(); // Reset form
        handleShowForm();
    };

    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
            {isFormVisible ? (
                <form onSubmit={handleSubmit}>
                    <div className='absolute top-0 right-0 flex text-xs text-white mt-2 mr-2'>
                        <button className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1' type='submit'>Add</button>
                        <button className='bg-red-500 hover:bg-red-700 rounded px-2 py-1' type='button' onClick={handleShowForm}>Cancel</button>
                    </div>

                    <div className='flex self-center text-xs text-white mt-4'>
                        <InputSpan spanText='หมู่' spanClass='ml-4 mr-2' inputClass='w-10 h-5' name='group_num' value={formData.group_num} onChange={handleInputChange} isSelect={false} />
                        <InputSpan spanText='จำนวน' spanClass='mr-2' inputClass='w-10 h-5' name='quantity' value={formData.quantity} onChange={handleInputChange} isSelect={false} />
                        <InputSpan spanText='หน่วย' spanClass='mr-2' inputClass='w-5 h-5' name='unit' value={formData.unit} onChange={handleInputChange} isSelect={false} />
                        <InputSpan spanText='ชั่วโมง' spanClass='mr-2' inputClass='w-5 h-5' name='hours' value={formData.hours} onChange={handleInputChange} isSelect={false} />
                    </div>

                    <div className='flex self-center text-xs text-white mt-3'>
                        <InputSpan spanText='วัน' spanClass='ml-4 mr-2' inputClass='w-12 h-5' name='day_of_week' value={formData.day_of_week} onChange={handleInputChange} isSelect={true} options={daysOfWeek} />
                        <InputSpan spanText='เริ่ม' spanClass='mr-2' inputClass='w-12 h-5' name='start_time' value={formData.start_time} onChange={handleInputChange} isSelect={true} options={timeOptions} />
                        <InputSpan spanText='สิ้นสุด' spanClass='mr-2' inputClass='w-12 h-5' name='end_time' value={formData.end_time} onChange={handleInputChange} isSelect={true} options={timeOptions} />
                    </div>

                    <div className='flex flex-col self-center text-xs text-white mt-3'>
                        <MultipleInput spanText='อาจารย์' spanClass={'ml-2 mr-4'} formData={formData} setFormData={setFormData} inputType='prof_name' data={profs} isProf={true} />
                        <br className='my-2' />
                        <MultipleInput spanText='สาขา' spanClass={'ml-5 mr-4'} formData={formData} setFormData={setFormData} inputType='branch_year' data={branch_year} isProf={false} maxLength={5} />

                        {isLab &&
                            <div className='mt-4'>
                                <InputSpan spanText='ห้องแลป' spanClass='ml-3 mr-1' inputClass='w-60 h-5' name='lab_room' value={formData.lab_room} onChange={handleInputChange} />
                            </div>
                        }
                    </div>
                </form>
            ) : <img src={plusIcon} alt='Add Section' className='h-24 self-center' onClick={handleShowForm} />}
        </div>
    );
}

//Components
const InputSpan = ({ spanText, spanClass, inputClass, name, value, onChange, isSelect, options }) => {
    return (
        <div className='flex self-center text-xs text-white mt-3'>
            <span className={spanClass}>{spanText}</span>
            {!isSelect ? (
                <input className={`text-black border rounded-sm mr-2 p-1 ${inputClass}`} type='text' required name={name} value={value} onChange={onChange} />
            ) : (
                <select className={`text-black border border-solid rounded-sm border-cyan-500 mr-2 p-1 appearance-none leading-none ${inputClass}`} name={name} value={value} onChange={onChange}>
                    <option value="">{spanText}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

const MultipleInput = ({ spanText, spanClass, formData, setFormData, inputType, data, isProf, ...props }) => {
    const handleAdd = () => {
        setFormData(prevData => ({
            ...prevData,
            [inputType]: [...prevData[inputType], ''] // Add an empty string to the specified inputType array
        }));
    };
    const handleChange = (e, index) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [inputType]: prevData[inputType].map((item, i) => (i === index ? value : item))
        }));
    };
    const handleRemove = (index) => {
        setFormData(prevData => ({
            ...prevData,
            [inputType]: prevData[inputType].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className='w-72 flex items-center text-xs text-white'>
            <span className={spanClass}>{spanText}</span>
            <div className='overflow-x-auto flex items-center'>

                {formData[inputType].map((item, index) => (
                    <div key={index} className='relative inline-block mr-2'>

                        <select
                            className='border rounded-sm appearance-none text-black p-1 mr-2'
                            value={item}
                            onChange={(e) => handleChange(e, index)}
                            {...props}
                        >
                            <option value="">select prof</option>
                            {isProf &&
                                data.map((d, index) => (
                                    <option key={index} value={d.name}>{d.name}</option>
                                ))
                            }
                            {!isProf && data.map((d, index) => (
                                <option key={index} value={d}>{d}</option>
                            ))}
                        </select>

                        {index !== formData[inputType].length - 1 && (
                            <button type='button' className='absolute top-0 right-2 text-xs text-red-500 font-bold' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <img src={plusIcon} alt={`Add ${inputType}`} className='h-5 cursor-pointer' onClick={handleAdd} />
            </div>
        </div>
    );
};
