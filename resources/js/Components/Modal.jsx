import React from "react";

const Modal = ({ children, className }) => {
    return (
        <div
            className={`fixed flex items-center justify-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] ${className}`}
        >
            <div className="w-[40%] rounded-lg gap-3 py-8 flex flex-col items-center text-black bg-white">
                {children}
            </div>
        </div>
    );
};

export default Modal;
