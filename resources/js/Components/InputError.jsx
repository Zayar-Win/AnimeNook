export default function InputError({ message, className = "", ...props }) {
    return (
        <span
            {...props}
            className={`text-xs absolute ${className} bottom-[-18px] text-red-500`}
        >
            {message}
        </span>
    );
}
