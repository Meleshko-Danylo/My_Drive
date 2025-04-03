import React, {useEffect, useState, KeyboardEvent} from 'react';
import {useFetchData} from "../Hooks/useFetchData";
import {Folder} from "../Core/Folder";
import {CreateFolder} from "../Api/Folders/CreateFolder";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import FormPopUpItem from "./FormPopUpItem";
import FormPopUp from "./FormPopUp";
import FolderItem from './FolderItem';
import FileItem from "./FileItem";
import '../Styles/FoldersManager.css';
import {useLocation, useNavigate} from "react-router";

const FoldersManager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const getPathFromUrl = (): string => {
        const match = location.pathname.match(/^\/App\/(.*)/);
        if (match && match[1]) {
            return `/${match[1]}`;
        }
        return '/';
    }
    
    const [currentPath, setCurrentPath] = useState<string>(getPathFromUrl());
    const [pathInput, setPathInput] = useState('');
    const [isEditingPath, setIsEditingPath] = useState(false);

    const {data, isLoading, error} = useFetchData<Folder>('/Folders/GetFolder', currentPath);
    const queryClient = useQueryClient();

    useEffect(() => {
        if(currentPath === '/') navigate('/App/');
        else {
            const urlPath = currentPath.substring(1);
            navigate(`/App/${urlPath}`);
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

    const [isOpenFolderEdit, setIsOpenFolderEdit] = useState(false);
    const [isOpenFileEdit, setIsOpenFileEdit] = useState(false);
    const [isOpenFolderAdd, setIsOpenFolderAdd] = useState(false);
    const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);

    const [folderEditForm, setFolderEditForm] = useState({
        name:'',
        path:'',
        isAccessible:false,
    });
    const [fileEditForm, setFileEditForm] = useState({
        name:'',
        path:'',
        isAccessible:false,
    });
    const [folderAddForm, setFolderAddForm] = useState({
        name:'New Folder',
        isAccessible:false,
    });
    // const [fileUploadForm, setFileUploadForm] = useState({
    //     name:'',
    //     path:'',
    //     isAccessible:false,
    // });

    const addFolderButtonRef = React.useRef(null);
    const uploadFileButtonRef = React.useRef(null);
    
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
                                disabled={!currentPath}
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
                            className="uploadFile" ref={uploadFileButtonRef}>Add File</button>
                    </div>
                </div>
                <div className="insideDirectory">
                    {data?.subFolders.map((folder:any)=>{
                        return(
                            <div key={folder.id} style={{width:'100%'}} >
                                <FolderItem
                                    data={folder}
                                    setIsOpenEdit={setIsOpenFolderEdit}
                                    setFolderEditForm={setFolderEditForm}
                                    onNavigate={navigateToFolder}
                                />
                            </div>
                        );
                    })}
                    {data?.files.map((file:any, index:number)=>{
                        return(
                            <div key={index}>
                                <FileItem data={file} setIsOpenEdit={setIsOpenFileEdit} setFilerEditForm={setFileEditForm}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <FormPopUp title={'Edit file'} isOpen={isOpenFileEdit} onClose={()=>{setIsOpenFileEdit(prev => !prev)}} onSubmit={()=>{}}>
                <FormPopUpItem label={'Name'} value={fileEditForm.name} className={''}
                               onChange={(e) => {setFileEditForm((prev) =>
                                   ({...prev, name:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Folder'} value={fileEditForm.path} className={''}
                               onChange={(e) => {setFileEditForm((prev) =>
                                   ({...prev, path:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Public'} value={fileEditForm.isAccessible} className={''}
                               onChange={(e) => {setFileEditForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'} />
            </FormPopUp>
            
            <FormPopUp title={'Edit folder'} isOpen={isOpenFolderEdit} onClose={()=>{setIsOpenFolderEdit(prev => !prev)}} onSubmit={()=>{}}>
                <FormPopUpItem label={'Name'} value={folderEditForm.name} className={''}
                               onChange={(e) => {setFolderEditForm((prev) =>
                                   ({...prev, name:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Folder'} value={folderEditForm.path} className={''}
                               onChange={(e) => {setFolderEditForm((prev) =>
                                   ({...prev, path:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Public'} value={folderEditForm.isAccessible} className={''}
                               onChange={(e) => {setFolderEditForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'}/>
            </FormPopUp>

            <FormPopUp title={'Add folder'} isOpen={isOpenFolderAdd} onClose={()=>{setIsOpenFolderAdd(prev => !prev)}}
                       buttonRef={addFolderButtonRef} onSubmit={async ()=>{await createFolder(
                           {
                               name:folderAddForm.name,
                               parentFolderId: data ? data.id : '',
                               path: data ? data.path : '/',
                               isAccessible:folderAddForm.isAccessible
                           }
                       )}}>
                <FormPopUpItem label={'Name'} value={folderAddForm.name} className={''}
                               onChange={(e) => {setFolderAddForm((prev) =>
                                   ({...prev, name:e.target.value}))}}
                               inputType={'text'}/>
                <FormPopUpItem label={'Public'} value={folderAddForm.isAccessible} className={''}
                               onChange={(e) => {setFolderAddForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'}/>
            </FormPopUp>

            <FormPopUp title={'Upload file'} isOpen={isOpenFileUpload} onClose={()=>{setIsOpenFileUpload(prev => !prev)}}
                       buttonRef={uploadFileButtonRef} onSubmit={()=>{}}>
                <FormPopUpItem label={'Name'} className={''}
                               onChange={() => {}}
                               inputType={'file'}/>
            </FormPopUp>
        </>
    );
};

export default FoldersManager;