import React from "react";
import ReactSelect from "react-select";
import InputLabel from "./InputLabel";

const Select = ({
    options,
    label,
    defaultValue,
    onChange,
    selected,
    isDisabled = false,
    isMulti=false
}) => {
    if (Array.isArray(selected)) {
        defaultValue = options.filter(option => selected.some(select => select.value === option.value))
    }else{
        defaultValue = options?.find(
            (option) => option.id === selected || option.value === selected
        );
    }

    return (
        <div>
            {label && <InputLabel value={label} />}
            {options.length && (
                <ReactSelect
                    isMulti={isMulti}
                    onChange={onChange}
                    options={options}
                    defaultValue={defaultValue}
                    isDisabled={isDisabled}
                />
            )}
        </div>
    );
};

export default Select;
