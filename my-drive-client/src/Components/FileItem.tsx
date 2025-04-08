import React, {useRef, useState} from 'react';
import {FileType} from "../Core/FileType";
import PopUpMenu from "./PopUpMenu";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteFileAsync} from "../Api/Files/DeleteFileAsync";
import {downloadFileAsync} from "../Api/Files/DownloadFileAsync";

type FileProps = {
    data: FileType,
    setIsOpenEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setFilerEditForm?: React.Dispatch<React.SetStateAction<any>>,
    onSelect: (file: FileType) => void
};

const FileItem = ({data, setIsOpenEdit, setFilerEditForm, onSelect}: FileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    const queryClient = useQueryClient();
    
    const {mutateAsync: deleteFile} = useMutation({
        mutationFn: deleteFileAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder']})
        }
    })
    
    const handleDoubleClick = () => {
        if (data) onSelect(data);
    }
    
    return (
        <div className="folderManager-item">
            <div onDoubleClick={handleDoubleClick}>
                <span className="file-icon"></span>{data.name}
            </div>
            <div>
                <button ref={buttonRef} className="popup-button" onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => !prev);
                }}>:</button>
                <PopUpMenu isOpen={isOpen}
                           onClose={() => {setIsOpen(false);} }
                           position={{x:100,y:0}}
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
                               {text: "Download", className: "", onClick: async ()=>{
                                   try {
                                       await downloadFileAsync(data.id, data.name);
                                   } catch (error) {
                                       console.error('Download failed:', error);
                                       alert('Failed to download file. Please try again.');
                                   }
                               }},
                               {text: "Delete", className: "", onClick: async ()=>{await deleteFile(data.id)}}
                           ]}
                />
            </div>
        </div>
    );
};

export default FileItem;