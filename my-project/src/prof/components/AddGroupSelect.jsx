import { useState, useCallback, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

export const SelectProf = ({ formData, setFormData, profsBranchTag }) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleAdd = useCallback(() => {
        if (formData.prof_name.length < profsBranchTag.length) {
            const lastSelectedOption = formData.prof_name[formData.prof_name.length - 1];
            if (lastSelectedOption && !selectedOptions.includes(lastSelectedOption)) {
                setSelectedOptions(prevOptions => [...prevOptions, lastSelectedOption]);
            }
            setFormData(prevData => ({
                ...prevData,
                prof_name: [...prevData.prof_name, ''] // Initialize new item with an empty string
            }));
        }
    }, [formData.prof_name, profsBranchTag.length, selectedOptions, setFormData]);
    const handleChange = useCallback((e, index) => {
        const value = e.target.value;
        const updatedData = formData.prof_name.map((item, i) => (i === index ? value : item));
        setFormData(prevData => ({
            ...prevData,
            prof_name: updatedData
        }));
    }, [formData.prof_name, setFormData]);
    const handleRemove = useCallback((index) => {
        const removedOption = formData.prof_name[index];
        setSelectedOptions(prevOptions => prevOptions.filter(option => option !== removedOption));
        setFormData(prevData => ({
            ...prevData,
            prof_name: prevData.prof_name.filter((_, i) => i !== index)
        }));
    }, [formData.prof_name, setFormData]);

    useEffect(() => {
        const profOptions = profsBranchTag
            .filter(prof => !selectedOptions.includes(prof.name))
            .map(prof => ({
                value: prof.name,
                label: prof.name
            }));
        setOptions(profOptions);
    }, [profsBranchTag, selectedOptions]);

    useEffect(() => {
        if (formData.prof_name.length === 0) {
            setFormData(prevData => ({
                ...prevData,
                prof_name: [''] // Initialize with an empty string
            }));
        }
    }, []);

    return (
        <div className='w-72 flex items-center gap-x-1 text-black'>
            <span className='text-white'>อาจารย์</span>
            <div className='overflow-x-auto flex items-center'>
                {formData.prof_name.map((item, index) => (
                    <div key={index} className='relative mr-2'>
                        {item && <p className='bg-white p-0'>{item}</p>}
                        {!item &&
                            <select
                                value=''
                                onChange={(e) => handleChange(e, index)}
                                required
                            >
                                <option value='' disabled>Select</option>
                                {options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        }
                        {index !== formData.prof_name.length - 1 && (
                            <button type='button' className='absolute top-[-5px] right-[-3px] text-xs font-bold text-red-500' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type='button' onClick={handleAdd} className='text-white'>
                    <FaPlus />
                </button>
            </div>
        </div>
    );
};

export const SelectBranchYear = ({ formData, setFormData, inputType, data }) => {
    const [options, setOptions] = useState([]);

    const handleAdd = useCallback(() => {
        if (formData[inputType].length < data.length) {
            const newItem = '';
            setFormData(prevData => ({
                ...prevData,
                [inputType]: [...prevData[inputType], newItem]
            }));
            setOptions(prevOptions => [...prevOptions, { value: newItem, label: newItem }]);
        }
    }, [data, formData, inputType, setFormData]);

    const handleChange = useCallback((e, index) => {
        const value = e.target.value;
        const updatedData = formData[inputType].map((item, i) => (i === index ? value : item));
        setFormData(prevData => ({
            ...prevData,
            [inputType]: updatedData
        }));
    }, [formData, inputType, setFormData]);

    const handleRemove = useCallback((index) => {
        const removedItem = formData[inputType][index];
        setFormData(prevData => ({
            ...prevData,
            [inputType]: prevData[inputType].filter((_, i) => i !== index)
        }));

        setOptions(prevOptions => prevOptions.filter(option => option.value !== removedItem));
    }, [formData, inputType, setFormData]);

    useEffect(() => {
        const availableOptions = data.filter(branchYear => !formData[inputType].includes(branchYear));
        const branchYearOptions = availableOptions.map(item => ({
            value: item,
            label: item
        }));
        setOptions(branchYearOptions);
    }, [data, formData, inputType]);


    useEffect(() => {
        if (formData.branch_year.length === 0) {
            setFormData(prevData => ({
                ...prevData,
                branch_year: [''] // Initialize with an empty string
            }));
        }
    }, []);

    return (
        <div className='w-72 flex items-center gap-x-1 text-black'>
            <span className='text-white'>สาขา</span>
            <div className='overflow-x-auto flex items-center'>
                {formData[inputType].map((item, index) => (
                    <div key={index} className='relative mr-2'>
                        {item ? (<p className='bg-white p-0'>{item}</p>) :
                            (
                                <select
                                    value=''
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                >
                                    <option value='' disabled>Select</option>
                                    {options.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            )}
                        {index !== formData[inputType].length - 1 && (
                            <button type='button' className='absolute top-[-6px] right-[-3px] text-xs font-bold text-red-500' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type='button' onClick={handleAdd} className='text-white'>
                    <FaPlus />
                </button>
            </div >
        </div >
    );
};