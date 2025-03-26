import React from 'react';
import {useFetchData} from "../Hooks/useFetchData";

const FoldersManager = () => {
    const {data, isLoading, error} = useFetchData('/api/folder'); 
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    
    return (
        <div className="folders-container">
            <div className="toolsBar">
                <span className="full-path">{data.fullPath}</span>
                <div className="toolsBar-buttons">
                    <button className="addFolder"></button>
                    <button className="uploadFile"></button>
                </div>
            </div>
            <div className="insideDirectory">
                {data.map((folder:any)=>(
                    <div key={folder.subFolders.id}>
                        <h3>{folder.subFolders.name}</h3>
                        <ul>
                            {folder.files.map((file:any)=><li key={file.id}>{file.name}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoldersManager;