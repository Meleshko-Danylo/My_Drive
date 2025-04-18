import React, {useEffect, useRef, useState} from 'react';
import {FileType} from "../Core/FileType";
import PopUpMenu from "./PopUpMenu";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteFileAsync} from "../Api/Files/DeleteFileAsync";
import {downloadFileAsync} from "../Api/Files/DownloadFileAsync";
import {openFileInNewTab} from "../Api/Files/OpenFileInNewTab";
import FormPopUpItem from "./FormPopUpItem";
import {v4 as uuidv4} from "uuid";
import FormPopUp from "./FormPopUp";

type FileProps = {
    data: FileType;
    onSelect: (file: FileType) => void;
    onSubmitFileEdit?: () => void;
};

const FileItem = ({data, onSelect, onSubmitFileEdit}: FileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [fileEditForm, setFileEditForm] = useState({
        name:'',
        path:'',
        isAccessible: data?.isAccessible || false,
    });
    const [publicUrlInput, setPublicUrlInput] = useState<string>(`${window.origin}/File/p/${data.id}`);
    const [isOpenFileEdit, setIsOpenFileEdit] = useState(false);
    
    const queryClient = useQueryClient();
    
    const {mutateAsync: deleteFile} = useMutation({
        mutationFn: deleteFileAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder']})
        }
    })

    useEffect(() => {
        
    }, []);
    
    const handleDoubleClick = async () => {
        if(data && (data.contentType === 'application/pdf' ||
            data.contentType.includes('google-docs') ||
            data.contentType.includes('ms-word') ||
            data.contentType.includes('ms-excel') ||
            data.contentType.includes('ms-powerpoint'))){
            await openFileInNewTab(data);
        }
        else if (data && (data.contentType.startsWith('text') ||
        data.contentType.startsWith('image'))) onSelect(data);
        else await downloadFileAsync(data.id, data.name);
    }
    
    const getFileIconClass = (): string => {
        if(data.contentType.startsWith("image")) {
            return "file-icon-image"
        } else if(data.contentType.startsWith("video")){
            return "file-icon-video"
        } else if(data.contentType.startsWith("audio")){
            return "file-icon-audio"
        } 
        // else if(data.contentType.startsWith("text")){
        //     return "file-icon-text"
        // }
        return "file-icon";
    }

    const handleCopyClick = async (e: any, publicUrlInput:string) => {
        e.preventDefault();
        await navigator.clipboard.writeText(publicUrlInput);
    }
    
    return (
        <>
            <div className="folderManager-item">
                <div onDoubleClick={handleDoubleClick}>
                    <span className={getFileIconClass()}></span>{data.name}
                </div>
                <div>
                    <button ref={buttonRef} className="popup-button" onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(prev => !prev);
                    }}>:</button>
                    <PopUpMenu isOpen={isOpen}
                               onClose={() => {setIsOpen(false);} }
                               position={{x:101,y:0}}
                               buttonRef={buttonRef}
                               options={[
                                   {text: "Preview", className: "", onClick: ()=>{
                                           onSelect(data);
                                       }},
                                   {text: "Edit", className: "", onClick: ()=>{
                                           setIsOpenFileEdit(prev => !prev);
                                           setFileEditForm({
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
            <FormPopUp title={'Edit file'} isOpen={isOpenFileEdit} buttonRef={buttonRef} 
                       onClose={()=>{setIsOpenFileEdit(prev => !prev)}} onSubmit={()=>{}}>

                <FormPopUpItem label={'Name'} value={fileEditForm.name} className={''}
                               onChange={(e) => {
                                   setFileEditForm((prev) =>
                                       ({...prev, name:e.target.value}))
                               }}
                               inputType={'text'}/>
                <FormPopUpItem label={'Folder'} value={fileEditForm.path} className={''}
                               onChange={(e) => {setFileEditForm((prev) =>
                                   ({...prev, path:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Public'} value={fileEditForm.isAccessible} className={''}
                               onChange={(e) => {setFileEditForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'} />
                {fileEditForm.isAccessible && (
                    <>
                        <input type="text" value={publicUrlInput}/>
                        <button onClick={(e) => handleCopyClick(e, publicUrlInput)} >Copy</button>
                    </>
                )}
            </FormPopUp>
        </>
    );
};

export default FileItem;