import React, {useRef, useState} from 'react';
import {Folder} from "../Core/Folder";
import PopUpMenu from "./PopUpMenu";
import {DeleteFolderAsync} from "../Api/Folders/DeleteFolderAsync";
import {downloadFolderAsync} from "../Api/Folders/DownloadFolderAsync";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import FormPopUpItem from "./FormPopUpItem";
import FormPopUp from "./FormPopUp";
import editFolder from "../Api/Folders/EditFolder";

type FolderProps = {
    data: Folder;
    isPublic:boolean;
    onNavigate?: (path: any) => void;
    onDoubleClick?: (folder: Folder) => void;
};

const FolderItem = ({data, onNavigate, onDoubleClick, isPublic}: FolderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [folderEditForm, setFolderEditForm] = useState({
        name:data.name,
        path:data.path,
        isAccessible:data?.isAccessible || false,
    });
    const [publicUrlInput, setPublicUrlInput] = useState<string>(`${window.origin}/Folder/p/${data.id}`);
    const [isOpenFolderEdit, setIsOpenFolderEdit] = useState(false);
    
    const queryClient = useQueryClient();
    const {mutateAsync: deleteFolderAsync} = useMutation({
        mutationFn: DeleteFolderAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder', data.path]});
        }
    });
    
    const {mutateAsync: editFolderAsync} = useMutation({
        mutationFn: editFolder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['/Folders/GetFolder', data.path]});
            setIsOpenFolderEdit(prev => !prev);
        }
    });

    const handleCopyClick = async (e: any, publicUrlInput:string) => {
        e.preventDefault();
        await navigator.clipboard.writeText(publicUrlInput);
    }
    
    const handleNavigationClick = () => {
        if(onDoubleClick) onDoubleClick(data);
        else if(onNavigate) onNavigate(data.path);
    };

    return (
        <>
            <div
                className="folderManager-item"
            >
                <div style={{display: "flex", alignItems: "center"}} onDoubleClick={handleNavigationClick}>
                    <span className="folder-icon">📁</span> {data.name}
                </div>
                <div>
                    <button ref={buttonRef} className="popup-button" onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering double-click
                        setIsOpen((prev) => !prev);
                    }}>:</button>
                    {!isPublic ? (
                        <PopUpMenu isOpen={isOpen}
                                   onClose={() => {setIsOpen(false)}}
                                   position={{x:101,y:0}}
                                   buttonRef={buttonRef}
                                   options={[
                                       {text: "Open", className: "", onClick: () => handleNavigationClick},
                                       {text: "Edit", className: "", onClick: ()=>{
                                               setIsOpenFolderEdit(prev => !prev);
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
                    ) : (
                        <PopUpMenu isOpen={isOpen}
                                   onClose={() => {setIsOpen(false)}}
                                   position={{x:101,y:0}}
                                   buttonRef={buttonRef}
                                   options={[
                                       {text: "Open", className: "", onClick: () => handleNavigationClick},
                                       {text: "Download", className: "", onClick: async ()=>{
                                               try {
                                                   await downloadFolderAsync(data.id, data.name);
                                               } catch (error) {
                                                   console.error('Download failed:', error);
                                                   alert('Failed to download folder. Please try again.');
                                               }
                                           }}
                                   ]}
                        />
                    )}
                </div>
            </div>
            {!isPublic && (
                <FormPopUp title={'Edit folder'} buttonRef={buttonRef} isOpen={isOpenFolderEdit}
                           onClose={()=>{setIsOpenFolderEdit(prev => !prev)}} onSubmit={async () => {
                    await editFolderAsync({
                        id: data.id, 
                        isAccessible: folderEditForm.isAccessible, 
                        name: folderEditForm.name, 
                        parentFolderId: data.parentFolderId ?? "", 
                        path: folderEditForm.path
                    })
                }}>
                    <FormPopUpItem label={'Name'} value={folderEditForm.name}
                                   onChange={(e) => {
                                       setFolderEditForm((prev) =>
                                           ({...prev, name:e.target.value}))
                                   }}
                                   inputType={'text'}/>
                    {/*<FormPopUpItem label={'Folder'} value={folderEditForm.path} className={''}*/}
                    {/*               onChange={(e) => {setFolderEditForm((prev) =>*/}
                    {/*                   ({...prev, path:e.target.value}))}}*/}
                    {/*               inputType={'text'}/>*/}
                    <FormPopUpItem label={'Public'} value={folderEditForm.isAccessible} className={''}
                                   onChange={(e) => {setFolderEditForm((prev =>
                                       ({...prev, isAccessible:e.target.checked})))}}
                                   inputType={'checkbox'}/>
                    {folderEditForm.isAccessible && (
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

export default FolderItem;