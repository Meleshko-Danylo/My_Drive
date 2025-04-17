import {useQuery} from "@tanstack/react-query";
import {FetchFolder} from "../Api/FetchFolder";
import {useState} from "react";
import {getFolderById} from "../Api/Folders/GetFolderById";

export function useFetchFolder<T = any>(path?: string, folderId?: string) {
    // const [fetchedData, setFetchedData] = useState<T>();
    const folderByIdQuery = useQuery({
        queryKey: ['/Folders/GetFolderById', folderId],
        queryFn: async () => await getFolderById<T>(folderId),
        enabled: !!folderId && !path
    });

    const folderByPathQuery = useQuery({
        queryKey: ['/Folders/GetFolder', path],
        queryFn: async () => await FetchFolder<T>(path),
        enabled: !!path && !folderId
    });

    const rootFolderQuery = useQuery({
        queryKey: ['/Folders/GetFolder', '/'],
        queryFn: async () => await FetchFolder<T>('/'),
        enabled: !path && !folderId
    });
    
    if(folderId && !path) return folderByIdQuery;
    if(!folderId && path) return folderByPathQuery;
    return rootFolderQuery;
}