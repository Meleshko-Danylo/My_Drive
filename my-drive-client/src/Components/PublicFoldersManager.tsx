﻿import React, {useState} from 'react';
import {Folder} from "../Core/Folder";
import {axiosInstance} from "../index";
import {useSelectedFileContext} from "../Pages/PublicFolderPage";
import {FileType} from "../Core/FileType";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import {downloadFolderAsync} from "../Api/Folders/DownloadFolderAsync";

type PublicFoldersManagerProps = {
    initialFolder: Folder;
};

const PublicFoldersManager = ({initialFolder}: PublicFoldersManagerProps) => {
    const [currentFolder, setCurrentFolder] = useState<Folder>(initialFolder);
    const {selectedFile, setSelectedFile} = useSelectedFileContext();
    const [isPathEditing, setIsPathEditing] = useState(false);
    const [pathInput, setPathInput] = useState<string>(currentFolder.path);
    
    const handleNavigateBack = async (folder: Folder) => {
        try {
            const newCurrentFolder = await axiosInstance.get(`Folders/NavigateInsidePublicFolder/${folder.parentFolderId}`)
            setCurrentFolder(newCurrentFolder.data);
        }
        catch(error){
            console.log("Error navigating back");
        }
    }
    const handleNavigateForward = async (folder: Folder) => {
        try {
            const newCurrentFolder = await axiosInstance.get(`Folders/NavigateInsidePublicFolder/${folder.id}`)
            setCurrentFolder(newCurrentFolder.data);
        }
        catch(error){
            console.log("Error navigating forward");
        }
    }
    const handlePathKeyPress = async (e: any) => {
        if(e.key === "Enter"){
            try {
                const newCurrentFolder = await axiosInstance.get(`Folders/GetFolderByPath?path=${pathInput}`);
                setCurrentFolder(newCurrentFolder.data);
                setIsPathEditing(false)
            }
            catch(error){
                console.log("Error navigating to path");
            }
        }
    }
    const handleSelectFile = (file: FileType) => {
           setSelectedFile(file);
    }
       
    return (
        <>
            <div className="folders-container">
                <div className="toolsBar">
                    {isPathEditing ? (
                        <input type="text"
                               className="path-input"
                               value={pathInput}
                               onChange={(e) => setPathInput(e.target.value)}
                               onKeyDown={(e) => handlePathKeyPress(e)}
                               onBlur={() => setIsPathEditing(false)}
                               autoFocus
                        />
                    ) : (
                        <div className="path-navigation">
                            <button
                                className="back-button"
                                onClick={() => handleNavigateBack(currentFolder)}
                                disabled={currentFolder.path === initialFolder.path}
                            >
                                ⬅️
                            </button>
                            <span
                                className="full-path"
                                onClick={() => setIsPathEditing(true)}
                            >
                                {currentFolder.path}
                            </span>
                        </div>
                    )}
                    <div className="toolsBar-buttons">
                        <button onClick={async ()=>{
                            try {
                                await downloadFolderAsync(currentFolder.id, currentFolder.name);
                            } catch (error) {
                                console.error('Download failed:', error);
                                alert('Failed to download folder. Please try again.');
                            }
                        }}
                                className="uploadFile">Download Folder</button>
                    </div>
                </div>
                <div className="insideDirectory">
                    {currentFolder.subFolders.map((folder:any)=>{
                        return(
                            <div key={folder.id} style={{width:'100%'}} >
                                <FolderItem
                                    isPublic={true}
                                    data={folder}
                                    onDoubleClick={handleNavigateForward}
                                />
                            </div>
                        );
                    })}
                    {currentFolder.files.map((file:any, index:number)=>{
                        return(
                            <div key={index} style={{width:'100%'}}>
                                <FileItem data={file}
                                          isPublic={true}
                                          onSelect={handleSelectFile}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default PublicFoldersManager;