import React from 'react';

type EditPopUpItemProps = {
    label: string;
    inputType: string;
    multiple?: boolean;
    webkitdirectory?: boolean;
    value?: any;
    onChange: (value: any) => void;
    className?: string;
    labelClassName?: string;
    children?: React.ReactNode;
    id?: string;
};

const FormPopUpItem = ({ label, inputType, value, multiple, webkitdirectory,
                           onChange, className, children, id, labelClassName}: EditPopUpItemProps) => {
    
    if(children) return <>{children}</>

    return (
        <>
            <div style={{width:'100%'}}>
                <label htmlFor={id ? id : label} className={labelClassName ? labelClassName : ""}>{label}</label>
                {inputType !== "checkbox" ? (
                        <input type={inputType} className={className ? className : "edit-popup-item-input"}
                               name={label} value={value || ""}
                               id={id ? id : ""}
                               {...(webkitdirectory ? {webkitdirectory: "true", directory: "true" } : {})}
                               {...(multiple ? {multiple: true} : {})}
                               onChange={(event)=> onChange(event)}/>
                    )
                    :
                    (
                        <input type={inputType} className={className ? className : "edit-popup-item-input"}
                               name={label} value={value || ""}
                               onChange={(event)=> onChange(event)} checked={value}/>
                    )
                }
            </div>
        </>
    );
};

export default FormPopUpItem;