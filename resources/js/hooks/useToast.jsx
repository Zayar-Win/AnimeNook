import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useToast = () => {
    const { toastMessage } = usePage().props;
    useEffect(() => {
        if (
            toastMessage.success ||
            toastMessage.warning ||
            toastMessage.error
        ) {
            let type = "success";
            let message = "";
            if (toastMessage.success) {
                type = "success";
                message = toastMessage.success;
            }
            if (toastMessage.warning) {
                type = "warning";
                message = toastMessage.warning;
            }
            if (toastMessage.error) {
                type = "error";
                message = toastMessage.error;
            }
            // toast.dismiss();
            toast(message, {
                type,
            });
        }
    }, [toastMessage]);
};

export default useToast;
