import React, {useState} from 'react';
import {useFetchData} from "../Hooks/useFetchData";
import {Folder} from "../Core/Folder";
import {CreateFolder} from "../Api/Folders/CreateFolder";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import EditPopUpItem from "./EditPopUpItem";
import EditPopUp from "./EditPopUp";
import FolderItem from './FolderItem';
import FileItem from "./FileItem";

const FoldersManager = () => {
    const {data, isLoading, error} = useFetchData<Folder>('/Folders/GetRootFolder'); 
    const queryClient = useQueryClient();
    const {mutateAsync: createFolder} = useMutation({
        mutationFn: CreateFolder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetRootFolder']});
        }
    });
    const [isOpenFolderEdit, setIsOpenFolderEdit] = useState(false);
    const [isOpenFileEdit, setIsOpenFileEdit] = useState(false);
    
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
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <>
            <div className="folders-container">
                <div className="toolsBar">
                    <span className="full-path">{data?.path}</span>
                    <div className="toolsBar-buttons">
                        <button onClick={async () => {
                            await createFolder({name:'New folder', path:data!.path, isAccessible:true,parentFolderId:data!.id});
                        }}
                                className="addFolder">Add Folder</button>
                        <button className="uploadFile">Add File</button>
                    </div>
                </div>
                <div className="insideDirectory">
                    {data?.subFolders.map((folder:any)=>{
                        return(
                            <div key={folder.id} style={{width:'100%'}} >
                                <FolderItem data={folder} setIsOpenEdit={setIsOpenFolderEdit} setFolderEditForm={setFolderEditForm}/>
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
            <EditPopUp title={'Edit file'} isOpen={isOpenFileEdit} onClose={()=>{setIsOpenFileEdit(prev => !prev)}} onSubmit={()=>{}}>
                <EditPopUpItem label={'Name'} value={fileEditForm.name} className={''}
                               onChange={(e) => {setFileEditForm((prev) =>
                                   ({...prev, name:e.target.value}))}}
                               inputType={'text'}/>
                <EditPopUpItem label={'Folder'} value={fileEditForm.path} className={''}
                               onChange={(e) => {setFileEditForm((prev) =>
                                   ({...prev, path:e.target.value}))}}
                               inputType={'text'}/>
                <EditPopUpItem label={'Public'} value={fileEditForm.isAccessible} className={''}
                               onChange={(e) => {setFileEditForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'} />
            </EditPopUp>
            <EditPopUp title={'Edit folder'} isOpen={isOpenFolderEdit} onClose={()=>{setIsOpenFolderEdit(prev => !prev)}} onSubmit={()=>{}}>
                <EditPopUpItem label={'Name'} value={folderEditForm.name} className={''}
                               onChange={(e) => {setFolderEditForm((prev) =>
                                   ({...prev, name:e.target.value}))}}
                               inputType={'text'}/>
                <EditPopUpItem label={'Folder'} value={folderEditForm.path} className={''}
                               onChange={(e) => {setFolderEditForm((prev) =>
                                   ({...prev, path:e.target.value}))}}
                               inputType={'text'}/>
                <EditPopUpItem label={'Public'} value={folderEditForm.isAccessible} className={''}
                               onChange={(e) => {setFolderEditForm((prev =>
                                   ({...prev, isAccessible:e.target.checked})))}}
                               inputType={'checkbox'}/>
            </EditPopUp>
        </>
    );
};

export default FoldersManager;