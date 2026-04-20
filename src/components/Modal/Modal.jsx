import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/scrollLock";

const Modal = forwardRef(({ children, onClose, className = "" }, ref) => {
    const dialogRef = useRef();
    const closeTimerRef = useRef(null);
    const [closing, setClosing] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => {
            const dialog = dialogRef.current;
            if (!dialog) return;

            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
                setClosing(false);
                return;
            }

            if (dialog.open) return;

            setClosing(false);
            dialog.showModal();
            lockBodyScroll();
        },
        close: () => {
            const dialog = dialogRef.current;
            if (!dialog || !dialog.open || closeTimerRef.current) return;

            setClosing(true);
            closeTimerRef.current = window.setTimeout(() => {
                closeTimerRef.current = null;
                if (dialog.open) dialog.close();
            }, 300);
        },
    }));

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };
    }, []);

    const requestClose = () => {
        ref?.current?.close();
        onClose?.();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        requestClose();
    };

    const handleNativeClose = () => {
        setClosing(false);
        unlockBodyScroll();
    };

    const handleClickOutside = (e) => {
        if (e.target === dialogRef.current) {
            requestClose();
        }
    };

    return createPortal(
        <dialog
            ref={dialogRef}
            onClick={handleClickOutside}
            onCancel={handleCancel}
            onClose={handleNativeClose}
            className={`modal ${className} ${closing ? "closing" : ""}`}
        >
            <div className='modal-outline'>
                <div className="modal-content">{children}</div>
            </div>
        </dialog>,
        document.getElementById("modal")
    );
});

export default Modal;
