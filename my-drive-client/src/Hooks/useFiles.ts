import {useState} from "react";
import {FileType} from "../Core/FileType";

export const useFiles = () => {
    const [logging, setLogging] = useState(false);
    const [error, setError] = useState(null);
    const [fileInfo, setFileInfo] = useState<FileType>({
        id: "",
        name: "",
        path: "",
        size: 0,
        createdAt: new Date(),
        isAccessible: false,
        contentType: "",
    });
    const [file, setFile] = useState<File | null>(null);
    
    return {logging, error, fileInfo, file};
}