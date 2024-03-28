import { useState, useEffect, useCallback } from 'react';
import { useProfsContext, useBranchesContext, useGroupContext } from '../../context/Prof-Context';
import { SelectBranchYear, SelectProf } from '../components/AddGroupSelect';
import { DAYS_OF_WEEK, Time_Options } from '../data_functions/SchedulerData';
import { checkOverlapWithYourself } from '../data_functions/functions';
import { initialAddGroupFormState } from '../data_functions/initialData';
import { IconData } from '../data_functions/IconData';
import AlertModal from '../../public/AlertModal';

export default function AddGroup({ mergedGroups, onAddSection, creditHours, isLab, setDisableSubmit }) {
    const { profsBranch } = useProfsContext();
    const { branchYear } = useBranchesContext();
    const { groupsByBranch } = useGroupContext();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isInvalidTime, setIsInvalidTime] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [formData, setFormData] = useState(initialAddGroupFormState);

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

        if (formData.end_time <= formData.start_time) {
            setAlertMessage('end_time more than start_time');
            setIsInvalidTime(true);
            return;
        }
        const isDuplicateGroup = mergedGroups.some(section =>
            section.group_num === formData.group_num
        );

        const isDuplicateDayAndTime = mergedGroups.some(section =>
            section.day_of_week === formData.day_of_week &&
            ((section.start_time <= formData.start_time && formData.start_time < section.end_time) ||
                (section.start_time < formData.end_time && formData.end_time <= section.end_time))
        );
        const overlapWithYourself = checkOverlapWithYourself(groupsByBranch, formData);

        if (isDuplicateGroup) {
            setAlertMessage(`${formData.group_num} is used for this course`);
            setIsDuplicate(true);
            return;
        } else if (isDuplicateDayAndTime || overlapWithYourself) {
            setAlertMessage(`${formData.prof_name.join(', ')} already have a course at this time (${formData.day_of_week} ${formData.start_time}-${formData.end_time}).`);
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

    return (
        <>
            <AlertModal isOpen={isDuplicate || isInvalidTime} onClose={isDuplicate ? () => setIsDuplicate(false) : () => setIsInvalidTime(false)} message={alertMessage} />
            <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4'>
                {isFormVisible ? (
                    <form onSubmit={handleAdd}>
                        <div className='absolute top-0 right-0 flex text-xs font-semibold text-white mt-1 mr-1'>
                            <button className='bg-green-500 hover:bg-green-700 rounded mr-2 px-2 py-1' type='submit'>Add</button>
                            <button className='bg-red-500 hover:bg-red-700 rounded px-2 py-1' type='button' onClick={handleFormToggle}>Cancel</button>
                        </div>

                        <div className='flex self-center justify-center text-xs text-white'>
                            <TextInput spanText='หมู่' inputClass='w-10 h-5' name='group_num' value={formData.group_num} onChange={handleInputChange} />
                            <TextInput spanText='จำนวน' inputClass='w-10 h-5' name='quantity' value={formData.quantity} onChange={handleInputChange} />
                            <TextInput spanText='หน่วย' inputClass='w-5 h-5' name='unit' value={formData.unit} onChange={handleInputChange} readOnly />
                            <TextInput spanText='ชั่วโมง' inputClass='w-5 h-5' name='hours' value={formData.hours} onChange={handleInputChange} />
                        </div>
                        <div className='flex self-center justify-evenly text-xs text-white mb-1'>
                            <SelectInput spanText='วัน' inputClass='w-12 h-6' name='day_of_week' value={formData.day_of_week} onChange={handleInputChange} options={DAYS_OF_WEEK} />
                            <SelectInput spanText='เริ่ม' inputClass='w-12 h-6' name='start_time' value={formData.start_time} onChange={handleInputChange} options={Time_Options} />
                            <SelectInput spanText='สิ้นสุด' inputClass='w-12 h-6' name='end_time' value={formData.end_time} onChange={handleInputChange} options={Time_Options} />
                        </div>

                        <div className='flex flex-col gap-y-2 self-center items-center text-xs text-white mt-2'>
                            <SelectProf formData={formData} setFormData={setFormData} profsBranchTag={profsBranch} />
                            <SelectBranchYear formData={formData} setFormData={setFormData} inputType='branch_year' data={branchYear} />
                        </div>
                        <div className='flex self-center ml-4 text-xs text-white'>
                            {isLab && <TextInput spanText='ห้องแลป' inputClass='w-30 h-5' name='lab_room' value={formData.lab_room} onChange={handleInputChange} />}
                        </div>
                    </form>
                ) : <img src={IconData['Plus']} alt='Add Section' className='h-24 self-center' onClick={handleFormToggle} />}
            </div>
        </>
    );
}

const TextInput = ({ spanText, inputClass, name, value, onChange, ...prop }) => (
    <div className='flex items-center gap-x-0.5 mt-3'>
        <span>{spanText}</span>
        <input className={`text-black border rounded-sm mr-2 p-1 ${inputClass}`}
            type='text'
            required
            name={name}
            value={value}
            onChange={onChange}
            {...prop}
        />
    </div>
);

const SelectInput = ({ spanText, inputClass, name, value, onChange, options }) => (
    <div className='flex items-center gap-0.5 mt-3'>
        <span>{spanText}</span>
        <select className={`text-black border border-solid rounded-sm border-cyan-500 mr-2 p-1 appearance-none leading-none ${inputClass}`}
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