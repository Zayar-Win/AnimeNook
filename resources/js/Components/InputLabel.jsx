export default function InputLabel({
    value,
    className = "",
    children,
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
            {value ? value : children}
        </label>
    );
}
