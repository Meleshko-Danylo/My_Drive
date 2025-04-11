import React, {useEffect, useState} from 'react';
import {useSelectedFileContext} from "../Pages/App";
import {FileType} from "../Core/FileType";
import FIlePreviewPopUp from "./FIlePreviewPopUp";

const FilesDisplayContainer = () => {
    const {selectedFile, setSelectedFile} = useSelectedFileContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(selectedFile && selectedFile.contentType.startsWith('text')){
            // fileDisplayContainerRef.current.style.display = "block";
            setIsOpen(true);
        }
        console.log(selectedFile);
    }, [selectedFile]);
    const handleClose = () => {
        setSelectedFile(null);
        setIsOpen(false);
    };
    const handleOpenInNewTabClick = async (file: FileType) => {
        console.log("openInNewTab", file);
    }
    
    return (
        <div>
            {isOpen && selectedFile && (
                <FIlePreviewPopUp 
                    file={selectedFile}
                    onClose={handleClose}
                    onOpenInNewTabClick={(file) => handleOpenInNewTabClick(file)}
                />
            )}
        </div>
    );
};

export default FilesDisplayContainer;