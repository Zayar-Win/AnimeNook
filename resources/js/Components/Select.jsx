import React from "react";
import ReactSelect from "react-select";
import InputLabel from "./InputLabel";

const Select = ({ options, label, defaultValue, onChange, selected }) => {
    if (selected) {
        defaultValue = options?.find(
            (option) => option.id === selected || option.value === selected
        );
    }
    return (
        <div>
            {label && <InputLabel value={label} />}
            {options.length && (
                <ReactSelect
                    onChange={onChange}
                    options={options}
                    defaultValue={defaultValue}
                />
            )}
        </div>
    );
};

export default Select;
