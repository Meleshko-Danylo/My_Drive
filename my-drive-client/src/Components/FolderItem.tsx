import React, {useRef, useState} from 'react';
import {Folder} from "../Core/Folder";
import PopUpMenu from "./PopUpMenu";
import {DeleteFolderAsync} from "../Api/Folders/DeleteFolderAsync";
import {downloadFolderAsync} from "../Api/Folders/DownloadFolderAsync";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type FolderProps = {
    data: Folder,
    setIsOpenEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setFolderEditForm?: React.Dispatch<React.SetStateAction<any>>,
    onNavigate: (path: string) => void
};

const FolderItem = ({data, setIsOpenEdit, setFolderEditForm, onNavigate}: FolderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const queryClient = useQueryClient();
    const {mutateAsync: deleteFolderAsync} = useMutation({
        mutationFn: DeleteFolderAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder']});
        }
    });

    const handleDoubleClick = () => {
        onNavigate(data.path);
    };

    return (
        <div
            className="folderManager-item"
        >
            <div onDoubleClick={handleDoubleClick}>
                <span className="folder-icon">📁</span> {data.name}
            </div>
            <div>
                <button ref={buttonRef} className="popup-button" onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering double-click
                    setIsOpen((prev) => !prev);
                }}>:</button>
                <PopUpMenu isOpen={isOpen}
                           onClose={() => {setIsOpen(false)}}
                           position={{x:100,y:0}}
                           buttonRef={buttonRef}
                           options={[
                               {text: "Open", className: "", onClick: () => onNavigate(data.path)},
                               {text: "Edit", className: "", onClick: ()=>{
                                   setIsOpenEdit(prev => !prev);
                                   setFolderEditForm && setFolderEditForm({
                                       name: data.name,
                                       path: data.path,
                                       isAccessible: data.isAccessible
                                   });
                               }},
                               {text: "Download", className: "", onClick: async ()=>{
                                   try {
                                       await downloadFolderAsync(data.id, data.name);
                                   } catch (error) {
                                       console.error('Download failed:', error);
                                       alert('Failed to download folder. Please try again.');
                                   }
                               }},
                               {text: "Delete", className: "", onClick: async ()=>{await deleteFolderAsync(data.id)}}
                           ]}
                />
            </div>
        </div>
    );
};

export default FolderItem;