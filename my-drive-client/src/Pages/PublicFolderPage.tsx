import React from 'react';
import { useParams } from 'react-router';
import {useFetchFolder} from "../Hooks/useFetchFolder";
import {Folder} from "../Core/Folder";
import Header from "../Components/Header";
import PublicFoldersManager from "../Components/PublicFoldersManager";

const PublicFolderPage = () => {
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
        <div className="public-folder-page">
            <Header />
            <PublicFoldersManager initialFolder={data!}/>
        </div>
    );
};

export default PublicFolderPage;