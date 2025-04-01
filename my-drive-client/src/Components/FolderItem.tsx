import React, {useEffect, useRef, useState} from 'react';
import {Folder} from "../Core/Folder";
import PopUpMenu from "./PopUpMenu";

type FolderProps = {
    data: Folder,
    setIsOpenEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setFolderEditForm?: React.Dispatch<React.SetStateAction<any>>
};

const FolderItem = ({data, setIsOpenEdit, setFolderEditForm}: FolderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    return (
        <div className="folderManager-item">
            <div>
                {data.name}
            </div>
            <div>
                <button ref={buttonRef} className="popup-button" onClick={() => {
                    setIsOpen((prev) => !prev);
                }}>:</button>
                <PopUpMenu isOpen={isOpen}
                           onClose={() => {setIsOpen(false)}}
                           position={{x:100,y:0}}
                           buttonRef={buttonRef}
                           options={[
                               {text: "Edit", className: "", onClick: ()=>{
                                   setIsOpenEdit(prev => !prev);
                                   setFolderEditForm && setFolderEditForm({
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

export default FolderItem;