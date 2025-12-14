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
    isMulti = false,
}) => {
    if (Array.isArray(selected)) {
        defaultValue = options.filter((option) =>
            selected.some((select) => select.value === option.value)
        );
    } else {
        defaultValue = options?.find(
            (option) => option.id === selected || option.value === selected
        );
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#1a1a1a",
            borderColor: state.isFocused ? "var(--primary-color)" : "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            padding: "0.25rem",
            boxShadow: state.isFocused ? "0 0 0 1px var(--primary-color)" : "none",
            "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.2)",
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            padding: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "var(--primary-color)"
                : state.isFocused
                ? "rgba(255, 255, 255, 0.05)"
                : "transparent",
            color: state.isSelected ? "white" : "#d4d4d8",
            cursor: "pointer",
            borderRadius: "0.5rem",
            margin: "0.25rem 0",
            ":active": {
                backgroundColor: state.isSelected ? "var(--primary-color)" : "rgba(255, 255, 255, 0.1)",
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white",
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.375rem",
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "white",
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#a1a1aa",
            ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
            },
        }),
        input: (provided) => ({
            ...provided,
            color: "white",
        }),
    };

    return (
        <div>
            {label && (
                <InputLabel
                    className="!text-zinc-400 !mb-1.5"
                    value={label}
                />
            )}
            {options.length > 0 && (
                <ReactSelect
                    isMulti={isMulti}
                    onChange={onChange}
                    options={options}
                    defaultValue={defaultValue}
                    isDisabled={isDisabled}
                    styles={customStyles}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            neutral50: "#a1a1aa", 
                        },
                    })}
                />
            )}
        </div>
    );
};

export default Select;
