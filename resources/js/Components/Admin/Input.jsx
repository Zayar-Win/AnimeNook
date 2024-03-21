import { forwardRef, useEffect, useRef } from "react";
import InputLabel from "../InputLabel";
import InputError from "../InputError";

export default forwardRef(function Input(
    {
        type = "text",
        label,
        errorMessage,
        className = "",
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
        <div>
            {label && <InputLabel value={label} />}
            <div className="relative">
                {!textarea ? (
                    <input
                        {...props}
                        type={type}
                        className={
                            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" +
                            className
                        }
                        ref={input}
                    />
                ) : (
                    <textarea
                        {...props}
                        className={
                            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" +
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
