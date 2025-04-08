import React from 'react';
import {useSelectedFileContext} from "../Pages/App";

const FilesDisplayContainer = () => {
    const {selectedFile, fileDisplayContainerRef, setSelectedFile} = useSelectedFileContext();
    
    return (
        <div ref={fileDisplayContainerRef} className="files-representation-container">
            
        </div>
    );
};

export default FilesDisplayContainer;