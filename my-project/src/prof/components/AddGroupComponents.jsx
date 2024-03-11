import { useState, useCallback, useEffect } from "react";

export const TextInput = ({ spanText, spanClass, inputClass, name, value, onChange, ...prop }) => {
    return (
        <div className='flex self-center mt-3'>
            <span className={spanClass}>{spanText}</span>
            <input
                className={`text-black border rounded-sm mr-2 p-1 ${inputClass}`}
                type='text'
                required
                name={name}
                value={value}
                onChange={onChange}
                {...prop}
            />
        </div>
    );
};

export const SelectInput = ({ spanText, spanClass, inputClass, name, value, onChange, options }) => {
    return (
        <div className='flex self-center mt-3'>
            <span className={spanClass}>{spanText}</span>
            <select
                className={`text-black border border-solid rounded-sm border-cyan-500 mr-2 p-1 appearance-none leading-none ${inputClass}`}
                name={name}
                value={value}
                onChange={onChange}
                required
            >
                <option value='' disabled>{spanText}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export const SelectProf = ({ formData, setFormData, profsBranchTag }) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const profOptions = profsBranchTag
            .filter(prof => !selectedOptions.includes(prof.name))
            .map(prof => ({
                value: prof.name,
                label: prof.name
            }));
        setOptions(profOptions);
    }, [profsBranchTag, selectedOptions]);

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
        if (formData.prof_name.length === 0) {
            setFormData(prevData => ({
                ...prevData,
                prof_name: [''] // Initialize with an empty string
            }));
        }
    }, []);

    return (
        <div className='w-72 flex items-center text-xs text-black'>
            <span className='ml-2 mr-4 text-white'>อาจารย์</span>
            <div className='overflow-x-auto flex items-center'>
                {formData.prof_name.map((item, index) => (
                    <div key={index} className='relative inline-block mr-2'>
                        {item &&
                            <p className='bg-white p-0'>{item}</p>
                        }
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
                            <button type='button' className='absolute top-[-5px] right-[-3px] text-xs text-red-500 font-bold' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                {formData.prof_name.length < profsBranchTag.length && (
                    <button type='button' onClick={handleAdd} className='text-white text-xl'>+</button>
                )}
            </div>
        </div>
    );
};

export const SelectBranchYear = ({ spanText, spanClass, formData, setFormData, inputType, data }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const availableOptions = data.filter(branchYear => !formData[inputType].includes(branchYear));
        const branchYearOptions = availableOptions.map(item => ({
            value: item,
            label: item
        }));
        setOptions(branchYearOptions);
    }, [data, formData, inputType]);

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
        if (formData.branch_year.length === 0) {
            setFormData(prevData => ({
                ...prevData,
                branch_year: [''] // Initialize with an empty string
            }));
        }
    }, []);

    return (
        <div className='w-72 flex items-center text-xs text-black'>
            <span className={spanClass + ' text-white'}>{spanText}</span>
            <div className='overflow-x-auto flex items-center'>
                {formData[inputType].map((item, index) => (
                    <div key={index} className='relative inline-block mr-2'>
                        {item ? (
                            <p className='bg-white p-0'>{item}</p>
                        ) : (
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
                            <button type='button' className='absolute top-[-6px] right-[-3px] text-xs text-red-500 font-bold' onClick={() => handleRemove(index)}>X</button>
                        )}
                    </div>
                ))}
                <button type='button' onClick={handleAdd} className='text-white text-xl'>+</button>
            </div >
        </div >
    );
};