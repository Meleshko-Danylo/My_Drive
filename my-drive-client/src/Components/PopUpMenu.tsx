import React, {MouseEventHandler, useEffect, useRef} from 'react';
import "../Styles/PopUps.css";

export type PopUpMenuProps = {
  onClose(): void;
  options: PopUpMenuOption[];
  position?: { x: number, y: number 
  };
  isOpen: boolean;
  buttonRef?: React.RefObject<HTMLElement | null>;
}

 export type PopUpMenuOption = {
    className: string;
    onClick: (e: any) => void;
    icon?: string;
    text: string;
}

const PopUpMenu = ({onClose, isOpen, options, position, buttonRef}: PopUpMenuProps) => {
    const popUpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) =>{
            const target = e.target as Node;
            let isButtonTarget = false;
            if(buttonRef) isButtonTarget = buttonRef.current?.contains(target) || false;
            
            if(popUpRef.current && !popUpRef.current.contains(target) && !isButtonTarget) {
                onClose();
            }
        }
        if(isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [popUpRef, isOpen]);
    
    if(!isOpen) return null;
    
    return (
        <div ref={popUpRef} className="popup-menu" style={{
            top: `${position?.y}px`, left:`${position?.x}%`}}>
            {options.map((option, index) => (
                <button key={index} className={`popup-menu-option ${option.className}`} onClick={(e)=>{
                    option.onClick(e);
                    onClose();
                }}>{option.icon ? <span>{option.text} <img src={option.icon} alt="popup-icon"/></span>
                    :
                    <span>{option.text}</span>}</button>
            ))}
        </div>
    );
};

export default PopUpMenu;