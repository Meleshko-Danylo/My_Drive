import React, {useEffect, useState} from 'react';
import {FileType} from "../Core/FileType";
import FIlePreviewPopUp from "./FIlePreviewPopUp";
import {openFileInNewTab} from "../Api/Files/OpenFileInNewTab";

type SelectedFileContextType = {
    selectedFile: FileType | null,
    setSelectedFile: React.Dispatch<React.SetStateAction<FileType | null>>,
};

type FilesDisplayContainerType = {
    useSelectedFileContext: () => SelectedFileContextType;
}

const FilesDisplayContainer = ({useSelectedFileContext}: FilesDisplayContainerType) => {
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