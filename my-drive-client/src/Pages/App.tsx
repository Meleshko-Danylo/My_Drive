import React, {createContext, useContext, useRef, useState} from 'react';
import '../Styles/App.css';
import FoldersManager from "../Components/FoldersManager";
import FilesDisplayContainer from "../Components/FilesDisplayContainer";
import {FileType} from "../Core/FileType";


type SelectedFileContextType = {
    selectedFile: FileType | null,
    setSelectedFile: React.Dispatch<React.SetStateAction<FileType | null>>,
    fileDisplayContainerRef: any,
};

const SelectedFileContext = createContext<SelectedFileContextType | undefined>(undefined);

export const useSelectedFileContext = () =>{
    const context = useContext(SelectedFileContext);
    if (!context){
        throw new Error('useSelectedFileContext must be used within a SelectedFileProvider');
    }
    
    return context;
}

function App() {
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const fileDisplayContainerRef = useRef<HTMLDivElement>(null);
    
    return (
        <SelectedFileContext.Provider value={{ selectedFile, setSelectedFile, fileDisplayContainerRef }}>
            <div className="App">
                <FoldersManager />
                <FilesDisplayContainer />
            </div>
        </SelectedFileContext.Provider>
    );
}

export default App;
