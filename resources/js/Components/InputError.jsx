export default function InputError({
    message,
    className = "",
    inline = false,
    ...props
}) {
    const text = Array.isArray(message) ? message[0] : message;
    if (text == null || text === "") {
        return null;
    }
    const position = inline
        ? "relative mt-1.5 block"
        : "absolute bottom-[-18px]";
    return (
        <span
            {...props}
            className={`text-xs ${position} text-red-500 ${className}`.trim()}
        >
            {text}
        </span>
    );
}
