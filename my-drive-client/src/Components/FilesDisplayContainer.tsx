import React, {useEffect, useState} from 'react';
import {useSelectedFileContext} from "../Pages/App";
import {FileType} from "../Core/FileType";
import FIlePreviewPopUp from "./FIlePreviewPopUp";
import {openFileInNewTab} from "../Api/Files/OpenFileInNewTab"; 

const FilesDisplayContainer = () => {
    const {selectedFile, setSelectedFile} = useSelectedFileContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(selectedFile){
            // fileDisplayContainerRef.current.style.display = "block";
            setIsOpen(true);
        }
    }, [selectedFile]);
    const handleClose = () => {
        setSelectedFile(null);
        setIsOpen(false);
    };
    const handleOpenInNewTabClick = async (file: FileType) => {
        try {
            await openFileInNewTab(file)
        } catch (error) {
            console.error('Error opening file in new tab:', error);
            alert('Failed to open file. Please try again.');
        }
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