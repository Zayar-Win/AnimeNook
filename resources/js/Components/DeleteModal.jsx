import React from "react";
import DeleteWarn from "@/../assets/DeleteWarn";
import Button from "./Button";

const DeleteModal = ({
    title,
    deleteHandler,
    setIsDeleteModalOpen,
    body = null,
}) => {
    return (
        <div className="fixed flex z-[1000] items-center justify-center top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm">
            <div className="lg:w-[400px] md:w-[500px] w-[90%] rounded-2xl p-8 flex flex-col items-center text-center bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <DeleteWarn className={"text-red-500 w-8 h-8"} />
                </div>
                
                <h1 className="text-xl font-black text-white mb-3 tracking-tight">
                    {title}
                </h1>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    {body ? body : "This action cannot be undone. Please confirm if you wish to proceed."}
                </p>

                <div className="flex gap-4 w-full">
                    <Button
                        type={"button"}
                        onClick={() => setIsDeleteModalOpen(false)}
                        className={"!bg-white/5 !text-white hover:!bg-white/10 !border-0 w-full rounded-xl !py-3 font-bold transition-all"}
                        text={"Cancel"}
                    />
                    <Button
                        type={"button"}
                        onClick={deleteHandler}
                        className={"!bg-red-500 w-full hover:!bg-red-600 !border-0 rounded-xl !py-3 font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-1"}
                        text={"Delete"}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
