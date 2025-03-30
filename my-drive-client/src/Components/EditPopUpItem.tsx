import React from 'react';

type EditPopUpItemProps = {
    label: string;
    inputType: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
};

const EditPopUpItem = ({ label, inputType, value, onChange, className, children}: EditPopUpItemProps) => {
    
    if(children) return <>{children}</>
    
    return (
        <>
            <label htmlFor={label}>{label}</label>
            <input type={inputType} className={className ? className : "edit-popup-item-input"} 
            name={label} value={value} 
            onChange={(event)=> onChange(event.target.value)}/>
        </>
    );
};

export default EditPopUpItem;