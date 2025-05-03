import React, {useState} from 'react';
import {FileType} from "../Core/FileType";
import {useParams} from "react-router";
import Header from "../Components/Header";
import FilesDisplayContainer from "../Components/FilesDisplayContainer";
import {useFile} from "../Hooks/useFiles";
import PublicFileManager from "../Components/PublicFileManager";


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

const PublicFilePage = () => {
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const {fileId} = useParams();
    const {data, error, isLoading} = useFile(fileId || '');

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
                <PublicFileManager publicFile={data!}/>
                <FilesDisplayContainer useSelectedFileContext={useSelectedFileContext} />
            </div>
        </SelectedFileContext.Provider>
    );
};

export default PublicFilePage;