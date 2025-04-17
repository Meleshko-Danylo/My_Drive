import React, {useState} from 'react';
import {Folder} from "../Core/Folder";

type PublicFoldersManagerProps = {
    initialFolder: Folder;
};

const PublicFoldersManager = ({initialFolder}: PublicFoldersManagerProps) => {
    const [currentFolder, setCurrentFolder] = useState<Folder>(initialFolder);
       
    return (
        <div>
            
        </div>
    );
};

export default PublicFoldersManager;