import React from "react";
import ReactSelect from "react-select";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

const Select = ({
    options,
    label,
    defaultValue,
    onChange,
    selected,
    isDisabled = false,
    isMulti = false,
    errorMessage = null,
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

    const hasError = Boolean(errorMessage);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            outline: "none",
            cursor: "pointer",
            backgroundColor: "#141414",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: hasError
                ? "rgba(239, 68, 68, 0.65)"
                : state.isFocused
                  ? "rgba(161, 161, 170, 0.45)"
                  : "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            minHeight: 46,
            paddingLeft: 2,
            paddingRight: 2,
            boxShadow: hasError
                ? "0 0 0 2px rgba(239, 68, 68, 0.2)"
                : state.isFocused
                  ? "0 0 0 2px rgba(237, 100, 0, 0.22)"
                  : "none",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            "&:hover": {
                borderColor: hasError
                    ? "rgba(239, 68, 68, 0.75)"
                    : state.isFocused
                      ? "rgba(161, 161, 170, 0.5)"
                      : "rgba(255, 255, 255, 0.16)",
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            padding: "0.375rem",
            boxShadow:
                "0 18px 40px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255,255,255,0.06)",
            overflow: "hidden",
            zIndex: 2,
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "min(50vh, 260px)",
            padding: "2px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 2000 }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "var(--primary-color)"
                : state.isFocused
                  ? "rgba(255, 255, 255, 0.06)"
                  : "transparent",
            color: state.isSelected ? "white" : "#e4e4e7",
            cursor: "pointer",
            borderRadius: "0.5rem",
            margin: "2px 0",
            padding: "10px 12px",
            fontSize: "0.875rem",
            ":active": {
                backgroundColor: state.isSelected
                    ? "var(--primary-color)"
                    : "rgba(255, 255, 255, 0.1)",
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#fafafa",
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
            color: "#fafafa",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#71717a",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isFocused ? "#a1a1aa" : "#71717a",
            padding: "0 10px",
            ":hover": { color: "#d4d4d8" },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: "#71717a",
            ":hover": { color: "#e4e4e7" },
        }),
    };

    return (
        <div className="relative">
            {label && (
                <InputLabel className="!text-zinc-400 !mb-1.5" value={label} />
            )}
            {options.length > 0 && (
                <ReactSelect
                    isMulti={isMulti}
                    onChange={onChange}
                    options={options}
                    defaultValue={defaultValue}
                    isDisabled={isDisabled}
                    styles={customStyles}
                    menuPortalTarget={menuPortalTarget}
                    menuPosition="fixed"
                    blurInputOnSelect
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            neutral50: "#a1a1aa",
                            neutral20: "rgba(255,255,255,0.08)",
                            neutral30: "rgba(255,255,255,0.12)",
                        },
                    })}
                />
            )}
            {errorMessage && <InputError message={errorMessage} />}
        </div>
    );
};

export default Select;
