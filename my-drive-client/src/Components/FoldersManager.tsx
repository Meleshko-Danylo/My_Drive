import React from 'react';
import {useFetchData} from "../Hooks/useFetchData";
import {CreateFolderDto, Folder} from "../Core/Folder";
import {CreateFolder} from "../Api/CreateFolder";

const FoldersManager = () => {
    const {data, isLoading, error} = useFetchData<Folder>('/Folders/GetRootFolder'); 
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div className="folders-container">
            <div className="toolsBar">
                <span className="full-path">{data?.path}</span>
                <div className="toolsBar-buttons">
                    <button onClick={(e) => CreateFolder(data!, "Newfolder", e)} 
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
                                {folder.files.map((file:any)=><li key={file.id}>{file.name}</li>)}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FoldersManager;