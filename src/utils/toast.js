import { Bounce, Flip, Slide, toast, Zoom } from 'react-toastify';

export const showToastMessage = (type, message) => {
    const toastTypes = {
        success: toast.success,
        error: toast.error,
        info: toast.info,
        warn: toast.warn
    };
    const showToast = toastTypes[type];

    return showToast(message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
    });
};
