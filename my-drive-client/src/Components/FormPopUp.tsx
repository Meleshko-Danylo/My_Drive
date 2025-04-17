import React, {useEffect} from 'react';
import {createPortal} from "react-dom";

type EditPopUpProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    buttonRef?: React.RefObject<HTMLElement | null>;
    title?: string | null;
    children: React.ReactNode;
};

const FormPopUp = ({isOpen, onClose, onSubmit, title, children, buttonRef}: EditPopUpProps) => {
    const popUpRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<{top: string, left: string}>({top: '50%', left: '50%'});
    const AppContainer = document.querySelector(".App")!;
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const isInsidePopUp = popUpRef.current?.contains(target);
            const isButtonClicked = buttonRef?.current?.contains(target) || false;

            if (!isInsidePopUp && !isButtonClicked) {
                onClose();
            }
        }
        if(isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if(popUpRef.current) {
            const rect = popUpRef.current.getBoundingClientRect();
            setPosition({
                top: `${window.innerHeight / 2 - rect.height / 2}px`,
                left: `${window.innerWidth / 2 - rect.width / 2}px`
            });
        }
    }, [children]);
    
    if (!isOpen) return null;
    
    return createPortal(
        <div ref={popUpRef} className="edit-popup"
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            <form onSubmit={onSubmit}>
                <h3 style={{margin: 0, paddingBottom: "1rem"}}>{title || ''}</h3>
                <div className="edit-popup-items">
                    {children}
                </div>
                <div className="edit-popup-buttons">
                    <button className="edit-popup-buttons-save" type='submit'>Save</button>
                    <button className="edit-popup-buttons-cancel" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>,
        AppContainer
    );
};

export default FormPopUp;