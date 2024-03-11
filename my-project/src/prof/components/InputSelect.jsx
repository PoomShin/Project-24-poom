import Select from 'react-select';

export default function InputSection({ value, onChange, placeholder, options, optionKey, style }) {
    const selectOptions = options.map(option => ({
        value: option[optionKey],
        label: option[optionKey]
    }));

    return (
        <Select
            className={style}
            value={value ? { value, label: value } : null}
            onChange={selectedOption => onChange(selectedOption?.value || '')}
            options={selectOptions}
            placeholder={placeholder}
        />
    );
}
