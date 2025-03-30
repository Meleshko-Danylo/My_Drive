import React from 'react';
import {useFetchData} from "../Hooks/useFetchData";
import {Folder} from "../Core/Folder";
import {CreateFolder} from "../Api/Folders/CreateFolder";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import PopUpMenu from "./PopUpMenu";
import EditPopUpItem from "./EditPopUpItem";
import EditPopUp from "./EditPopUp";

const FoldersManager = () => {
    const {data, isLoading, error} = useFetchData<Folder>('/Folders/GetRootFolder'); 
    const queryClient = useQueryClient();
    const {mutateAsync: createFolder} = useMutation({
        mutationFn: CreateFolder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey:['/Folders/GetRootFolder']});
        }
    });
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div className="folders-container">
            <div className="toolsBar">
                <span className="full-path">{data?.path}</span>
                <div className="toolsBar-buttons">
                    <button onClick={async () => {
                        await createFolder({name:'New folder', path:data!.path + 'New folder/', isAccessible:true,parentFolderId:data!.id});
                    }} 
                            className="addFolder">Add Folder</button>
                    <button className="uploadFile">Add File</button>
                </div>
            </div>
            <div className="insideDirectory">
                {data?.subFolders.map((folder:any)=>{
                    return(
                        <div key={folder.id}>
                            <h3>{folder.name}</h3>
                            <ul>
                                {folder.files.map((file:any)=><li key={file.id}>{file.name}
                                <PopUpMenu isOpen={false} 
                                           onClose={() => {} }
                                           position={{x:0,y:0}}
                                           options={[
                                               {text: "Edit", className: "", onClick: ()=>{}},
                                               {text: "Download", className: "", onClick: ()=>{}},
                                               {text: "Delete", className: "", onClick: ()=>{}}
                                           ]}
                                />
                                </li>)}
                            </ul>
                        </div>
                    );
                })}
            </div>
            <EditPopUp title={'Edit file'} isOpen={false} onClose={()=>{}} onSubmit={()=>{}}>
                <EditPopUpItem label={'Name'} value={''} className={''} onChange={() => {}} inputType={'text'}/>
                <EditPopUpItem label={'Public'} value={''} className={''} onChange={() => {}} inputType={'checkbox'}/>
                <EditPopUpItem label={'Folder'} value={''} className={''} onChange={() => {}} inputType={'text'}/>
            </EditPopUp>
            <EditPopUp title={'Edit folder'} isOpen={false} onClose={()=>{}} onSubmit={()=>{}}>
                <EditPopUpItem label={'Name'} value={''} className={''} onChange={() => {}} inputType={'text'}/>
                <EditPopUpItem label={'Public'} value={''} className={''} onChange={() => {}} inputType={'checkbox'}/>
                <EditPopUpItem label={'Folder'} value={''} className={''} onChange={() => {}} inputType={'text'}/>
            </EditPopUp>
        </div>
    );
};

export default FoldersManager;