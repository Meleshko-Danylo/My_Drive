import React from 'react';

type EditPopUpProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string | null;
    children: React.ReactNode;
};

const EditPopUp = ({isOpen, onClose, onSubmit, title, children}: EditPopUpProps) => {
    
    if (!isOpen) return null;
    
    return (
        <div className="edit-popup">
            <form onSubmit={onSubmit}>
                <h4>{title || ''}</h4>
                <div className="edit-popup-items">
                    {children}
                </div>
                <div className="edit-popup-buttons">
                    <button type='submit'>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditPopUp;