import { useState, useEffect } from 'react';
import { useProfsContext, useBranchesContext } from '../../context/Prof-Context';
import plusIcon from '../../assets/plus.png';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 24; hour++) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 24 && minute > 0) {
                break; // Break the loop if the hour exceeds 20:00
            }
            const formattedMinute = minute === 0 ? '00' : minute;
            options.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return options;
};

const timeOptions = generateTimeOptions();

export default function AddGroup({ onAddSection, creditHours, isLab, }) {
    const { profsBranchTag } = useProfsContext();
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
        setFormData(prevData => ({
            ...prevData,
            prof_name: [],
            branch_year: []
        })); // Reset only prof_name and branch_year fields
        handleShowForm();
    };

    useEffect(() => {
        const hours = isLab ? creditHours.labHours : creditHours.lectureHours;
        const unit = isLab ? Math.ceil(creditHours.labHours / 3) : creditHours.lectureHours;
        const adjustedHours = creditHours.lectureHours > 3 ? '' : hours;

        setFormData(prevData => ({
            ...prevData,
            hours: adjustedHours,
            unit
        }));
    }, [creditHours, isLab]);

    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
            {isFormVisible ? (
                <form onSubmit={handleSubmit} className=''>
                    <div className='absolute top-0 right-0 flex text-xs text-white mt-1 mr-1'>
                        <button className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1' type='submit'>Add</button>
                        <button className='bg-red-500 hover:bg-red-700 rounded px-2 py-1' type='button' onClick={handleShowForm}>Cancel</button>
                    </div>

                    <div className='flex self-center text-xs text-white'>
                        <InputSpan spanText='หมู่' spanClass='ml-4 mr-2' inputClass='w-10 h-5' name='group_num' value={formData.group_num} onChange={handleInputChange} isSelect={false} />
                        <InputSpan spanText='จำนวน' spanClass='mr-2' inputClass='w-10 h-5' name='quantity' value={formData.quantity} onChange={handleInputChange} isSelect={false} />
                        <InputSpan spanText='หน่วย' spanClass='mr-2' inputClass='w-5 h-5' name='unit' value={formData.unit} onChange={handleInputChange} isSelect={false} readOnly />
                        <InputSpan spanText='ชั่วโมง' spanClass='mr-2' inputClass='w-5 h-5' name='hours' value={formData.hours} onChange={handleInputChange} isSelect={false} />
                    </div>

                    <div className='flex self-center text-sm text-white mb-1'>
                        <InputSpan spanText='วัน' spanClass='ml-4 mr-2' inputClass='w-12 h-6' name='day_of_week' value={formData.day_of_week} onChange={handleInputChange} isSelect={true} options={daysOfWeek} />
                        <InputSpan spanText='เริ่ม' spanClass='mr-2' inputClass='w-12 h-6' name='start_time' value={formData.start_time} onChange={handleInputChange} isSelect={true} options={timeOptions} />
                        <InputSpan spanText='สิ้นสุด' spanClass='mr-2' inputClass='w-12 h-6' name='end_time' value={formData.end_time} onChange={handleInputChange} isSelect={true} options={timeOptions} />
                    </div>

                    <div className='flex flex-col self-center text-xs text-white mt-2'>
                        <SelectProf formData={formData} setFormData={setFormData} profsBranchTag={profsBranchTag} />
                        <div className='mb-2'></div>
                        <SelectBranchYear spanText='สาขา' spanClass={'ml-5 mr-4'} formData={formData} setFormData={setFormData} inputType='branch_year' data={branch_year} isProf={false} maxLength={5} />

                        {isLab &&
                            <div>
                                <InputSpan spanText='ห้องแลป' spanClass='ml-3 mr-1' inputClass='w-30 h-5' name='lab_room' value={formData.lab_room} onChange={handleInputChange} />
                            </div>
                        }
                    </div>
                </form>
            ) : <img src={plusIcon} alt='Add Section' className='h-24 self-center' onClick={handleShowForm} />}
        </div>
    );
}

//Components
const InputSpan = ({ spanText, spanClass, inputClass, name, value, onChange, isSelect, options, ...prop }) => {
    return (
        <div className='flex self-center mt-3'>
            <span className={spanClass}>{spanText}</span>
            {!isSelect ? (
                <input className={`text-black border rounded-sm mr-2 p-1 ${inputClass}`}
                    type='text'
                    required
                    name={name}
                    value={value}
                    onChange={onChange}
                    {...prop}
                />
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

const SelectProf = ({ formData, setFormData, profsBranchTag }) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const profOptions = profsBranchTag
            .filter(prof => !selectedOptions.includes(prof.name)) // Filter out selected options
            .map(prof => ({
                value: prof.name,
                label: prof.name
            }));
        setOptions(profOptions);
    }, [profsBranchTag, selectedOptions]);

    const handleAdd = () => {
        const lastSelectedOption = formData.prof_name[formData.prof_name.length - 1];
        if (lastSelectedOption && !selectedOptions.includes(lastSelectedOption)) {
            setSelectedOptions(prevOptions => [...prevOptions, lastSelectedOption]);
        }
        setFormData(prevData => ({
            ...prevData,
            prof_name: [...prevData.prof_name, ''] // Initialize new item with an empty string
        }));
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            prof_name: prevData.prof_name.map((item, i) => (i === index ? value : item))
        }));
    };

    const handleRemove = (index) => {
        const removedOption = formData.prof_name[index];
        setSelectedOptions(prevOptions => prevOptions.filter(option => option !== removedOption));
        setFormData(prevData => ({
            ...prevData,
            prof_name: prevData.prof_name.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className='w-72 flex items-center text-xs text-black'>
            <span className='ml-2 mr-4 text-white'>อาจารย์</span>
            <div className='overflow-x-auto flex items-center'>
                {formData.prof_name.map((item, index) => (
                    <div key={index} className='relative inline-block mr-2'>
                        <select
                            value={item || ''} // Use an empty string for null values
                            onChange={(e) => handleChange(e, index)}
                            className='custom-select'
                        >
                            <option value=''>Select</option>
                            {options.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {index !== formData.prof_name.length - 1 && (
                            <button type='button' className='absolute top-0 right-2 text-xs text-red-500 font-bold' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type='button' onClick={handleAdd} className='text-white text-xl'>+</button>
            </div>
        </div>
    );
};

const SelectBranchYear = ({ spanText, spanClass, formData, setFormData, inputType, data, maxLength }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const availableOptions = data.filter(branchYear => !formData[inputType].includes(branchYear));
        const branchYearOptions = availableOptions.map(item => ({
            value: item,
            label: item
        }));
        setOptions(branchYearOptions);
    }, [data, formData, inputType]); // Update the dependency array

    const handleAdd = () => {
        if (formData[inputType].length < maxLength) {
            const newItem = '';
            setFormData(prevData => ({
                ...prevData,
                [inputType]: [...prevData[inputType], newItem] // Initialize with empty string
            }));
            setOptions(prevOptions => [...prevOptions, { value: newItem, label: newItem }]);
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        const updatedData = formData[inputType].map((item, i) => (i === index ? value : item));
        setFormData(prevData => ({
            ...prevData,
            [inputType]: updatedData
        }));
    };

    const handleRemove = (index) => {
        const removedItem = formData[inputType][index];
        setFormData(prevData => ({
            ...prevData,
            [inputType]: prevData[inputType].filter((_, i) => i !== index)
        }));

        // Remove the removed item from options
        setOptions(prevOptions => prevOptions.filter(option => option.value !== removedItem));
    };

    return (
        <div className='w-72 flex items-center text-xs text-black'>
            <span className={spanClass + ' text-white'}>{spanText}</span>
            <div className='overflow-x-auto flex items-center'>
                {formData[inputType].map((item, index) => (
                    <div key={index} className='relative inline-block mr-2'>
                        <select
                            value={item || ''} // Use an empty string for null values
                            onChange={(e) => handleChange(e, index)}
                            className='custom-select'
                        >
                            <option value=''>Select</option>
                            {options.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {index !== formData[inputType].length - 1 && (
                            <button type='button' className='absolute top-0 right-2 text-xs text-red-500 font-bold' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type='button' onClick={handleAdd} className='text-white text-xl'>+</button>
            </div>
        </div>
    );
};