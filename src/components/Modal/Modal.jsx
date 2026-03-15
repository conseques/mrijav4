import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(({ children, onClose, className = "" }, ref) => {
    const dialogRef = useRef();
    const [closing, setClosing] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => {
            if (dialogRef.current) {
                setClosing(false);
                dialogRef.current.showModal();
            }
        },
        close: () => {
            if (dialogRef.current) {
                setClosing(true);
                setTimeout(() => {
                    dialogRef.current.close();
                }, 300);
            }
        },
    }));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                ref?.current?.close();
                onClose?.();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleClickOutside = (e) => {
        if (e.target === dialogRef.current) {
            ref?.current?.close();
            onClose?.();
        }
    };

    return createPortal(
        <dialog
            ref={dialogRef}
            onClick={handleClickOutside}
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
