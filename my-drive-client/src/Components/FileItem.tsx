﻿import React, {useRef, useState} from 'react';
import {FileType} from "../Core/FileType";
import PopUpMenu from "./PopUpMenu";

type FileProps = {
    data: FileType,
    setIsOpenEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setFilerEditForm?: React.Dispatch<React.SetStateAction<any>>
};

const FileItem = ({data, setIsOpenEdit, setFilerEditForm}: FileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    return (
        <div className="folderManager-item">
            <div>
                {data.name}
            </div>
            <div>
                <button ref={buttonRef} className="popup-button">:</button>
                <PopUpMenu isOpen={isOpen}
                           onClose={() => {setIsOpen(false);} }
                           position={{x:0,y:0}}
                           buttonRef={buttonRef}
                           options={[
                               {text: "Edit", className: "", onClick: ()=>{
                                   setIsOpenEdit(prev => !prev);
                                   setFilerEditForm && setFilerEditForm({
                                       name: data.name,
                                       path: data.path,
                                       isAccessible: data.isAccessible
                                   });
                               }},
                               {text: "Download", className: "", onClick: ()=>{}},
                               {text: "Delete", className: "", onClick: ()=>{}}
                           ]}
                />
            </div>
        </div>
    );
};

export default FileItem;