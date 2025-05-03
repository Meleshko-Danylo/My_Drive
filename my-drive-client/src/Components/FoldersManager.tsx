import React, {useEffect, useState, KeyboardEvent} from 'react';
import {useFetchFolder} from "../Hooks/useFetchFolder";
import {Folder, UploadFolderDto} from "../Core/Folder";
import {CreateFolder} from "../Api/Folders/CreateFolder";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import FormPopUpItem from "./FormPopUpItem";
import FormPopUp from "./FormPopUp";
import FolderItem from './FolderItem';
import FileItem from "./FileItem";
import '../Styles/FoldersManager.css';
import {useLocation, useNavigate} from "react-router";
import {uploadFileAsync} from "../Api/Files/UploadFileAsync";
import {useSelectedFileContext} from "../Pages/App";
import {FileType} from "../Core/FileType";
import { v4 as uuidv4 } from 'uuid';
import uploadFolder from "../Api/Folders/UploadFolder";

const FoldersManager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {selectedFile, setSelectedFile} = useSelectedFileContext();

    const getPathFromUrl = (): string => {
        const match = location.pathname.match(/^\/App\/(.*)/);
        if (match && match[1]) return `/${match[1]}`;
        return '/';
    }
    
    const [currentPath, setCurrentPath] = useState<string>(getPathFromUrl());
    const [pathInput, setPathInput] = useState('');
    const [isEditingPath, setIsEditingPath] = useState(false);

    const {data, isLoading, error} = useFetchFolder<Folder>(currentPath, undefined);
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if(currentPath === '/') navigate('/App/');
        else {
            const urlPath = `/App/${currentPath.substring(1)}`;
            if (urlPath !== location.pathname) navigate(urlPath);
        }
    }, [currentPath, navigate]);
    
    useEffect(() => {
        if (data) {
            setPathInput(data.path);
        }
    }, [data]);

    const {mutateAsync: createFolder} = useMutation({
        mutationFn: CreateFolder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder', currentPath]});
        }
    });
    
    const {mutateAsync: uploadFile} = useMutation({
        mutationFn: uploadFileAsync,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder', currentPath]});
            setFileUploadForm({
                file:null,
                isAccessible:data?.isAccessible || false
            });
        }
    })
    
    const {mutateAsync: uploadFolderMutation} = useMutation({
        mutationFn: uploadFolder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetFolder', currentPath]})
            setFolderUploadForm({
                files:[],
                isAccessible:data?.isAccessible || false
            })
        }
    })
    
    const [isOpenFolderAdd, setIsOpenFolderAdd] = useState(false);
    const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);
    const [isOpenFolderUpload, setIsOpenFolderUpload] = useState(false);
    
    const [folderAddForm, setFolderAddForm] = useState({
        name:'New Folder',
        isAccessible: data?.isAccessible || false
    });
    const [fileUploadForm, setFileUploadForm] = useState({
        file: null as File|null,
        isAccessible: data?.isAccessible || false
    });
    const [folderUploadForm, setFolderUploadForm] = useState({
        files:[] as File[],
        isAccessible: data?.isAccessible || false
    })

    const [publicUrlInput, setPublicUrlInput] = useState({
        folderAdd: `${window.origin}/Folder/p/${uuidv4()}`,
        fileUpload: `${window.origin}/File/p/${uuidv4()}`,
        folderUpload: `${window.origin}/Folder/p/${uuidv4()}`
    });
    

    const addFolderButtonRef = React.useRef(null);
    const uploadFileButtonRef = React.useRef(null);
    const uploadFolderButtonRef = React.useRef(null);
    
    const fileUploadFormChangeHandler = (event: any) => {
        const selectedFiles = event.target.files;
        if(selectedFiles) setFileUploadForm({...fileUploadForm, file:selectedFiles[0]})
    }
    
    const fileUploadSubmitHandler = async () => {
        if(!fileUploadForm.file){
            alert('Please select a file to upload.');
            return;
        }

        await uploadFile({
            file: fileUploadForm.file,
            folderId: data!.id,
            fileId: getIdForPublicLink(PublicLinkKeys.fileUpload),
            isAccessible: fileUploadForm.isAccessible
        });
    }
    
    const folderUploadChangeHandler = (event: any) => {
        const selectedFiles = Array.from<File>(event.target.files);
        if(selectedFiles) setFolderUploadForm({...folderUploadForm, files:selectedFiles})
    }
    
    const folderUploadSubmitHandler = async () => {
        if(folderUploadForm.files.length === 0){
            alert("No files selected");
            return;
        }
        
        await uploadFolderMutation({
            files:folderUploadForm.files,
            isAccessible:folderUploadForm.isAccessible,
            parentFolderId:data?.id ?? ''
        })
    }
    
    const selectedFileOnClickHandler = (file:FileType) =>{
        setSelectedFile(file);
    }
    const navigateToFolder = (folderPath: string) => {
        setCurrentPath(folderPath);
    };
    
    const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPathInput(e.target.value);
    };
    
    const handlePathKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPath(pathInput);
            setIsEditingPath(false);
        }
    };
    
    const navigateToParentFolder = () => {
        if (!data || !data.path) return;

        const pathParts = data.path.split('/').filter(Boolean);
        if (pathParts.length <= 1) {
            setCurrentPath('/');
        } else {
            pathParts.pop();
            const parentPath = '/' + pathParts.join('/') + '/';
            setCurrentPath(parentPath);
        }
    };

    const handleCopyClick = async (e: any, publicUrlInput:string) => {
        e.preventDefault();
        await navigator.clipboard.writeText(publicUrlInput);
    }
    
    const getIdForPublicLink = (inputName: string)=> {
        let parts = [];
        switch (inputName){
            case 'folderAdd':
                parts = publicUrlInput.folderAdd.split('/');
                return parts[parts.length - 1];
            case 'fileUpload':
                parts = publicUrlInput.fileUpload.split('/');
                return parts[parts.length - 1];
            case 'folderUpload':
                parts = publicUrlInput.folderUpload.split('/');
                return parts[parts.length - 1];
        }
        return '';
    }
    
    enum PublicLinkKeys{
        folderAdd='folderAdd',
        fileUpload='fileUpload',
        folderUpload='folderUpload'
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <>
            <div className="folders-container">
                <div className="toolsBar">
                    {isEditingPath ? (
                        <input
                            type="text"
                            className="path-input"
                            value={pathInput}
                            onChange={handlePathInputChange}
                            onKeyDown={handlePathKeyPress}
                            onBlur={() => setIsEditingPath(false)}
                            autoFocus
                        />
                    ) : (
                        <div className="path-navigation">
                            <button
                                className="back-button"
                                onClick={navigateToParentFolder}
                                disabled={currentPath === '/'}
                            >
                                ⬅️
                            </button>
                            <span
                                className="full-path"
                                onClick={() => setIsEditingPath(true)}
                            >
                                {data?.path}
                            </span>
                        </div>
                    )}
                    <div className="toolsBar-buttons">
                        <button onClick={() => {setIsOpenFolderAdd((prev) => !prev)}}
                                className="addFolder" ref={addFolderButtonRef}>Add Folder</button>
                        <button onClick={() => {setIsOpenFileUpload((prev) => !prev)}}
                            className="uploadFile" ref={uploadFileButtonRef}>Upload File</button>
                        <button onClick={() => {setIsOpenFolderUpload((prev) => !prev)}}
                                className="uploadFile" ref={uploadFolderButtonRef}>Upload Folder</button>
                    </div>
                </div>
                <div className="insideDirectory">
                    {data?.subFolders.map((folder:any)=>{
                        return(
                            <div key={folder.id} style={{width:'100%'}} >
                                <FolderItem
                                    isPublic={false}
                                    data={folder}
                                    onNavigate={navigateToFolder}
                                />
                            </div>
                        );
                    })}
                    {data?.files.map((file:any, index:number)=>{
                        return(
                            <div key={index} style={{width:'100%'}}>
                                <FileItem data={file}
                                          isPublic={false}
                                          onSelect={selectedFileOnClickHandler}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            <FormPopUp title={'Add folder'} isOpen={isOpenFolderAdd} onClose={()=>{
                setIsOpenFolderAdd(prev => !prev);
                setFolderAddForm({
                    name:'New Folder',
                    isAccessible:data?.isAccessible || false
                });
            }}
                       buttonRef={addFolderButtonRef} onSubmit={async ()=>{await createFolder(
                           {
                               id: getIdForPublicLink(PublicLinkKeys.folderAdd),
                               name:folderAddForm.name,
                               parentFolderId: data ? data.id : '',
                               path: data ? data.path : '/',
                               isAccessible:folderAddForm.isAccessible
                           }
                       )}}>
                <FormPopUpItem label={'Name'} value={folderAddForm.name} className={''}
                               onChange={(e) => {
                                   setFolderAddForm((prev) =>
                                   ({...prev, name:e.target.value}))
                                   }}
                               inputType={'text'}/>
                <FormPopUpItem label={'Public'} value={folderAddForm.isAccessible} className={''}
                               onChange={(e) => {setFolderAddForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))
                                   setPublicUrlInput((prev)=>(
                                       {...prev,folderAdd:`${window.origin}/Folder/p/${uuidv4()}`}
                                   ))
                               }}
                               inputType={'checkbox'}/>
                {folderAddForm.isAccessible && (
                    <div style={{display: 'flex'}}>
                        <input type="text" className="edit-popup-item-input" value={publicUrlInput.folderAdd}/>
                        <button className="copy-public-link-button"
                            onClick={(e) => handleCopyClick(e, publicUrlInput.folderAdd)} >Copy</button>
                    </div>
                )}
            </FormPopUp>
            
            <FormPopUp title={'Upload file'} isOpen={isOpenFileUpload}
                       onClose={()=>{
                           setIsOpenFileUpload(prev => !prev);
                           setFileUploadForm({
                               file:null,
                               isAccessible:data?.isAccessible || false
                           });
                       }}
                       buttonRef={uploadFileButtonRef} onSubmit={async ()=>{
                await fileUploadSubmitHandler();
            }}>
                <div className="file-upload-form">
                    <FormPopUpItem label={'Select File'} labelClassName={'custom-file-upload'}
                                   onChange={(e) => {fileUploadFormChangeHandler(e)}}
                                   inputType={'file'} id={"upload-file"}/>
                    {fileUploadForm.file && (
                        <div className='selected-file-info'>
                            <p>Name: {fileUploadForm.file.name}</p>
                            <p>Type: {fileUploadForm.file.type}</p>
                            <p>Size: {(fileUploadForm.file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    )}
                </div>
                <FormPopUpItem label={'Public'} value={fileUploadForm.isAccessible} 
                               onChange={(e) => {setFileUploadForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))
                                   setPublicUrlInput((prev)=>(
                                       {...prev,fileUpload:`${window.origin}/File/p/${uuidv4()}`}
                                   ))
                               }}
                               inputType={'checkbox'}/>
                {fileUploadForm.isAccessible && (
                    <div style={{display: 'flex'}}>
                        <input type="text" className="edit-popup-item-input" value={publicUrlInput.fileUpload}/>
                        <button className="copy-public-link-button"
                            onClick={(e) => handleCopyClick(e, publicUrlInput.fileUpload)} >Copy</button>
                    </div>
                )}
            </FormPopUp>

            <FormPopUp title={'Upload folder'} isOpen={isOpenFolderUpload}
                       onClose={()=>{
                           setIsOpenFolderUpload(prev => !prev);
                           setFolderUploadForm({
                               files:[],
                               isAccessible:data?.isAccessible || false
                           });
                       }}
                       buttonRef={uploadFolderButtonRef} onSubmit={async ()=>{
                await folderUploadSubmitHandler();
            }}>
                <div className="file-upload-form">
                    {/*<FormPopUpItem label={'Select Folder'} labelClassName={'custom-file-upload'}*/}
                    {/*               multiple={true} id={"upload-folder"}*/}
                    {/*               webkitdirectory={true}*/}
                    {/*               onChange={(e) => {folderUploadChangeHandler(e)}}*/}
                    {/*               inputType={'file'}/>*/}
                    <div style={{width:'100%'}}>
                        <label htmlFor="upload-folder" className="custom-file-upload">Select Folder</label>
                        <input type="file" className="custom-file-upload" multiple id={"upload-folder"}
                            {...{
                                webkitdirectory: "true",
                                directory: "true"
                            } as React.InputHTMLAttributes<HTMLInputElement>}
                               onChange={(e) => {folderUploadChangeHandler(e)}}/>
                    </div>
                    {folderUploadForm.files.length > 0 && (
                        <div className='selected-file-info'>
                            <p>Size: {(folderUploadForm.files.reduce((total, file) => total + file.size, 0)/1024).toFixed(2)} KB</p>
                        </div>
                    )}
                </div>
                <FormPopUpItem label={'Public'} value={folderUploadForm.isAccessible}
                               onChange={(e) => {setFolderUploadForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))
                                   setPublicUrlInput((prev)=>(
                                       {...prev,folderUpload:`${window.origin}/Folder/p/${uuidv4()}`}
                                   ))
                               }}
                               inputType={'checkbox'}/>
                {folderUploadForm.isAccessible && (
                    <>
                        <div style={{display: 'flex'}}>
                            <input type="text" className="edit-popup-item-input" value={publicUrlInput.folderUpload}/>
                            <button className="copy-public-link-button"
                                    onClick={(e) => handleCopyClick(e, publicUrlInput.folderUpload)}>Copy</button>
                        </div>
                    </>
                )}
            </FormPopUp>
        </>
    );
};

export default FoldersManager;