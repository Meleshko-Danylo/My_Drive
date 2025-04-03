import React from 'react';

type EditPopUpItemProps = {
    label: string;
    inputType: string;
    value?: any;
    onChange: (value: any) => void;
    className?: string;
    children?: React.ReactNode;
};

const FormPopUpItem = ({ label, inputType, value, onChange, className, children}: EditPopUpItemProps) => {
    
    if(children) return <>{children}</>

    return (
        <>
            <div>
                <label htmlFor={label}>{label}</label>
                <input type={inputType} className={className ? className : "edit-popup-item-input"}
                       name={label} value={value || ""}
                       onChange={(event)=> onChange(event)}/>
            </div>
        </>
    );
};

export default FormPopUpItem;