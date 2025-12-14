import { forwardRef, useEffect, useRef } from "react";
import InputLabel from "../InputLabel";
import InputError from "../InputError";

export default forwardRef(function Input(
    {
        type = "text",
        label,
        errorMessage,
        className = "",
        labelClassName = "",
        direction = "column",
        inputContainerClassName = "",
        isFocused = false,
        textarea = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className={`${direction === "row" ? "flex items-center " : ""}`}>
            {label && (
                <InputLabel
                    className={`!text-zinc-400 !mb-1.5 ${labelClassName}`}
                    value={label}
                />
            )}
            <div className={`relative ${inputContainerClassName}`}>
                {!textarea ? (
                    <input
                        {...props}
                        type={type}
                        className={
                            "bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-all duration-300 placeholder:text-zinc-600 " +
                            className
                        }
                        ref={input}
                    />
                ) : (
                    <textarea
                        {...props}
                        className={
                            "bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-all duration-300 placeholder:text-zinc-600 " +
                            className
                        }
                        rows={6}
                        cols={30}
                    />
                )}

                <InputError message={errorMessage} />
            </div>
        </div>
    );
});
