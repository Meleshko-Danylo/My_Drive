import React, {useState} from 'react';
import { useParams } from 'react-router';
import {useFetchFolder} from "../Hooks/useFetchFolder";
import {Folder} from "../Core/Folder";
import Header from "../Components/Header";
import PublicFoldersManager from "../Components/PublicFoldersManager";
import FilesDisplayContainer from "../Components/FilesDisplayContainer";
import {FileType} from "../Core/FileType";


type SelectedFileContextType = {
    selectedFile: FileType | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<FileType | null>>;
};

const SelectedFileContext = React.createContext<SelectedFileContextType | undefined>(undefined);

export const useSelectedFileContext = () => {
    const context = React.useContext(SelectedFileContext);
    if (!context) throw new Error('useSelectedFileContext must be used within a SelectedFileProvider');
    return context;
}

const PublicFolderPage = () => {
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const {folderId} = useParams();
    const {data, error, isLoading} = useFetchFolder<Folder>(undefined, folderId);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;
    
    if(data && !data.isAccessible){
        return (
            <>
                <Header />
                <div className="public-error">
                    <h3>Access Denied!</h3>
                    <p>You don't have access to this folder</p>
                    <a href="/Home" className="btn btn-primary"><button>Go Home</button></a>
                </div>
            </>
        )
    }
    
    return (
        <SelectedFileContext.Provider value={{selectedFile, setSelectedFile}}>
            <Header />
            <div className="public-folder-page">
                <PublicFoldersManager initialFolder={data!}/>
                <FilesDisplayContainer useSelectedFileContext={useSelectedFileContext} />
            </div>    
        </SelectedFileContext.Provider>
    );
};

export default PublicFolderPage;