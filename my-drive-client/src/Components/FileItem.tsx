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
import editFolder from "../Api/Folders/EditFolder";
import {updateFileAsync} from "../Api/Files/UpdateFileAsync";

type FileProps = {
    data: FileType;
    onSelect: (file: FileType) => void;
    isPublic: boolean;
};

const FileItem = ({data, onSelect, isPublic}: FileProps) => {
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
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder', data.path]})
        }
    })
    const {mutateAsync: editFileAsync} = useMutation({
        mutationFn: updateFileAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['/Folders/GetFolder', data.path]});
            setIsOpenFileEdit(prev => !prev);
        }
    });
    
    useEffect(() => {
        
    }, []);
    
    const handleDoubleClick = async () => {
        if (!data || !data.contentType) {
            console.error("Missing data or contentType in handleDoubleClick:", data);
            return;
        }
        
        // Convert to lowercase for case-insensitive comparison
        const contentType = data.contentType.toLowerCase();
        
        if (contentType === 'application/pdf' ||
            contentType.includes('google-docs') ||
            contentType.includes('word') ||
            contentType.includes('excel') ||
            contentType.includes('powerpoint') ||
            contentType.includes('msword') ||
            contentType.includes('spreadsheetml') ||
            contentType.includes('presentationml')) {
            await openFileInNewTab(data);
        }
        else if (contentType.startsWith('text/') ||
                contentType.startsWith('image/') ||
                contentType.startsWith('video/')) {
            onSelect(data);
        }
        else {
            await downloadFileAsync(data.id, data.name);
        }
    }
    
    const getFileIconClass = (): string => {
        if (!data || !data.contentType) {
            return "file-icon";
        }
        const contentType = data.contentType.toLowerCase();
        
        if (contentType.startsWith("image/")) {
            return "file-icon-image";
        } else if (contentType.startsWith("video/")) {
            return "file-icon-video";
        } else if (contentType.startsWith("audio/")) {
            return "file-icon-audio";
        } else if (contentType.startsWith("text/")) {
            return "file-icon-text";
        } else if (contentType === "application/pdf") {
            return "file-icon-pdf";
        } else if (contentType.includes("word") || 
                  contentType.includes("wordprocessingml") || 
                  contentType.includes("msword") ||
                  contentType.includes("document")) {
            return "file-icon-word";
        } else if (contentType.includes("excel") || 
                  contentType.includes("spreadsheetml") || 
                  contentType.includes("sheet")) {
            return "file-icon-excel";
        } else if (contentType.includes("powerpoint") || 
                  contentType.includes("presentationml") || 
                  contentType.includes("presentation")) {
            return "file-icon-powerpoint";
        } else if (contentType.includes("google-docs")) {
            return "file-icon-gdoc";
        } else if (contentType.includes("zip") || 
                  contentType.includes("rar") || 
                  contentType.includes("tar") || 
                  contentType.includes("compressed") ||
                  contentType.includes("archive")) {
            return "file-icon-archive";
        } else if (contentType.includes("javascript") || 
                  contentType.includes("json") || 
                  contentType.includes("html") || 
                  contentType.includes("css") ||
                  contentType.includes("code") ||
                  contentType.includes("xml")) {
            return "file-icon-code";
        }
        return "file-icon";
    }

    const handleCopyClick = async (e: any, publicUrlInput:string) => {
        e.preventDefault();
        await navigator.clipboard.writeText(publicUrlInput);
    }
    
    return (
        <>
            <div className="folderManager-item">
                <div style={{display: "flex", alignItems: "center"}} onDoubleClick={handleDoubleClick}>
                    <span className={getFileIconClass()}></span>{data.name}
                </div>
                <div>
                    <button ref={buttonRef} className="popup-button" onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(prev => !prev);
                    }}>:</button>
                    {!isPublic ? (
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
                    ) : (
                        <PopUpMenu isOpen={isOpen}
                                   onClose={() => {setIsOpen(false);} }
                                   position={{x:101,y:0}}
                                   buttonRef={buttonRef}
                                   options={[
                                       {text: "Preview", className: "", onClick: ()=>{
                                               onSelect(data);
                                           }},
                                       {text: "Download", className: "", onClick: async ()=>{
                                               try {
                                                   await downloadFileAsync(data.id, data.name);
                                               } catch (error) {
                                                   console.error('Download failed:', error);
                                                   alert('Failed to download file. Please try again.');
                                               }
                                           }},
                                   ]}
                        />
                    )}
                </div>
            </div>
            {!isPublic && (
                <FormPopUp title={'Edit file'} isOpen={isOpenFileEdit} buttonRef={buttonRef}
                           onClose={()=>{setIsOpenFileEdit(prev => !prev)}} onSubmit={async () => {
                    await editFileAsync({
                        fileId: data.id,
                        isAccessible: fileEditForm.isAccessible,
                        name: fileEditForm.name,
                        folderId: data.folderId ?? '',
                    })}}>

                    <FormPopUpItem label={'Name'} value={fileEditForm.name} 
                                   onChange={(e) => {
                                       setFileEditForm((prev) =>
                                           ({...prev, name:e.target.value}))
                                   }}
                                   inputType={'text'}/>
                    {/*<FormPopUpItem label={'Folder'} value={fileEditForm.path} className={''}*/}
                    {/*               onChange={(e) => {setFileEditForm((prev) =>*/}
                    {/*                   ({...prev, path:e.target.value}))}}*/}
                    {/*               inputType={'text'}/>*/}
                    <FormPopUpItem label={'Public'} value={fileEditForm.isAccessible} className={''}
                                   onChange={(e) => {setFileEditForm((prev =>
                                       ({...prev, isAccessible:e.target.checked})))}}
                                   inputType={'checkbox'} />
                    {fileEditForm.isAccessible && (
                        <div style={{display: 'flex'}}>
                            <input type="text" className="edit-popup-item-input" value={publicUrlInput} onChange={() => {}}/>
                            <button className="copy-public-link-button" 
                                onClick={(e) => handleCopyClick(e, publicUrlInput)} >Copy</button>
                        </div>
                    )}
                </FormPopUp>
            )}
        </>
    );
};

export default FileItem;