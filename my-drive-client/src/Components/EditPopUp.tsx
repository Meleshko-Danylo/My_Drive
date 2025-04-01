import React, {useEffect} from 'react';

type EditPopUpProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string | null;
    children: React.ReactNode;
};

const EditPopUp = ({isOpen, onClose, onSubmit, title, children}: EditPopUpProps) => {
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const popUp = document.querySelector(".edit-popup");
            if(popUp && !popUp.contains(target)) onClose();
        }
        if(isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
        <div className="edit-popup">
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
        </div>
    );
};

export default EditPopUp;