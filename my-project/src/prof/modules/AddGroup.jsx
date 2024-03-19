import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProfsContext, useBranchesContext, useGroupContext } from '../../context/Prof-Context';
import { TextInput, SelectInput, SelectBranchYear, SelectProf } from '../components/AddGroupComponents';
import AlertModal from '../../public/AlertModal';
import plusIcon from '../../assets/plus.png';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function simplifyTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 24; hour++) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 24 && minute > 0) {
                break;
            }
            const formattedMinute = minute === 0 ? '00' : minute;
            options.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return options;
};

const timeOptions = generateTimeOptions();

export default function AddGroup({ mergedGroups, onAddSection, creditHours, isLab, setDisableSubmit }) {
    const { profsBranchTag } = useProfsContext();
    const { branch_year } = useBranchesContext();
    const { groupsByBranch } = useGroupContext();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isInvalidTime, setIsInvalidTime] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

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

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    const handleFormToggle = useCallback(() => {
        setDisableSubmit(prev => !prev);
        setIsFormVisible(prevState => !prevState);
    }, [setDisableSubmit]);

    const handleAdd = useCallback(async (e) => {
        e.preventDefault();

        const overlapWithYourself = groupsByBranch.find(group =>
            group.prof_names.some(profName => formData.prof_name.includes(profName)) && // Check if any professor name in group matches any professor name in formData.prof_name
            group.day_of_week === formData.day_of_week &&
            ((simplifyTime(group.start_time) >= formData.start_time && simplifyTime(group.start_time) < formData.end_time) ||
                (simplifyTime(group.end_time) > formData.start_time && simplifyTime(group.end_time) <= formData.end_time)
            )
        );
        if (overlapWithYourself) {
            setAlertMessage(`${formData.prof_name.join(', ')} already have a course at this time (${formData.day_of_week} ${formData.start_time}-${formData.end_time}).`);
            setIsDuplicate(true);
            return;
        }

        if (formData.end_time <= formData.start_time) {
            setAlertMessage('Time frame is not correct');
            setIsInvalidTime(true);
            return;
        }

        const isDuplicate = mergedGroups.some(section =>
            section.group_num === formData.group_num ||
            (section.day_of_week === formData.day_of_week &&
                (section.start_time === formData.start_time || section.end_time === formData.end_time))
        );
        if (isDuplicate) {
            setAlertMessage('Duplicate group or day and time');
            setIsDuplicate(true);
            return;
        }

        onAddSection(formData);
        setFormData(prevData => ({
            ...prevData,
            prof_name: [],
            branch_year: []
        }));
        handleFormToggle();
    }, [formData, groupsByBranch, mergedGroups, onAddSection, handleFormToggle]);

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

    const memoizedDaysOfWeek = useMemo(() => daysOfWeek, []);
    const memoizedTimeOptions = useMemo(() => timeOptions, []);

    return (
        <>
            <AlertModal isOpen={isDuplicate || isInvalidTime} onClose={isDuplicate ? () => setIsDuplicate(false) : () => setIsInvalidTime(false)} message={alertMessage} />
            <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
                {isFormVisible ? (
                    <form onSubmit={handleAdd}>
                        <div className='absolute top-0 right-0 flex text-xs text-white mt-1 mr-1'>
                            <button className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1' type='submit'>Add</button>
                            <button className='bg-red-500 hover:bg-red-700 rounded px-2 py-1' type='button' onClick={handleFormToggle}>Cancel</button>
                        </div>

                        <div className='flex self-center text-xs text-white'>
                            <TextInput spanText='หมู่' spanClass='ml-4 mr-2' inputClass='w-10 h-5' name='group_num' value={formData.group_num} onChange={handleInputChange} />
                            <TextInput spanText='จำนวน' spanClass='mr-2' inputClass='w-10 h-5' name='quantity' value={formData.quantity} onChange={handleInputChange} />
                            <TextInput spanText='หน่วย' spanClass='mr-2' inputClass='w-5 h-5' name='unit' value={formData.unit} onChange={handleInputChange} readOnly />
                            <TextInput spanText='ชั่วโมง' spanClass='mr-2' inputClass='w-5 h-5' name='hours' value={formData.hours} onChange={handleInputChange} />
                        </div>

                        <div className='flex self-center text-sm text-white mb-1'>
                            <SelectInput spanText='วัน' spanClass='ml-4 mr-2' inputClass='w-12 h-6' name='day_of_week' value={formData.day_of_week} onChange={handleInputChange} options={memoizedDaysOfWeek} />
                            <SelectInput spanText='เริ่ม' spanClass='mr-2' inputClass='w-12 h-6' name='start_time' value={formData.start_time} onChange={handleInputChange} options={memoizedTimeOptions} />
                            <SelectInput spanText='สิ้นสุด' spanClass='mr-2' inputClass='w-12 h-6' name='end_time' value={formData.end_time} onChange={handleInputChange} options={memoizedTimeOptions} />
                        </div>

                        <div className='flex flex-col self-center text-xs text-white mt-2'>
                            <SelectProf formData={formData} setFormData={setFormData} profsBranchTag={profsBranchTag} />
                            <div className='mb-2'></div>
                            <SelectBranchYear spanText='สาขา' spanClass={'ml-5 mr-4'} formData={formData} setFormData={setFormData} inputType='branch_year' data={branch_year} isProf={false} />

                            {isLab &&
                                <div>
                                    <TextInput spanText='ห้องแลป' spanClass='ml-3 mr-1' inputClass='w-30 h-5' name='lab_room' value={formData.lab_room} onChange={handleInputChange} />
                                </div>
                            }
                        </div>
                    </form>
                ) : <img src={plusIcon} alt='Add Section' className='h-24 self-center' onClick={handleFormToggle} />}
            </div>
        </>
    );
}