export default function InputLabel({
    value,
    className = "",
    children,
    isOptional = false,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block mb-2 text-sm font-semibold text-gray-900 dark:text-white ` +
                className
            }
        >
            <div className="flex items-center">
                {value ? value : children}{" "}
                {isOptional && (
                    <span className="text-xs font-medium pl-2">(optional)</span>
                )}
            </div>
        </label>
    );
}
