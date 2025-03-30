import React, {MouseEventHandler, useEffect, useRef} from 'react';

export type PopUpMenuProps = {
  onClose(): void;
  options: PopUpMenuOption[];
  position?: { x: number, y: number 
  };
  isOpen: boolean;
}

 export type PopUpMenuOption = {
    className: string;
    onClick: (e: any) => void;
    icon?: string;
    text: string;
}

const PopUpMenu = ({onClose, isOpen, options, position}: PopUpMenuProps) => {
    const popUpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) =>{
            if(popUpRef.current && !popUpRef.current.contains(e.target as Node)) onClose();
            if(isOpen) document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [popUpRef, isOpen]);
    
    if(!isOpen) return null;
    
    return (
        <div ref={popUpRef} className="popup-menu" style={{top: `${position?.y}px`, left:`${position?.x}px`}}>
            {options.map((option, index) => (
                <button key={index} className={`popup-menu-option ${option.className}`} onClick={(e)=>{
                    // e.stopPropagation();
                    option.onClick(e);
                    onClose();
                }}>option.icon ? <span>{option.text} <img src={option.icon} alt="popup-icon"/></span> 
                    :
                    <span>{option.text}</span></button>
            ))}            
        </div>
    );
};

export default PopUpMenu;