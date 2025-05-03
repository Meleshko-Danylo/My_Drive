import {useState} from "react";
import {FileType} from "../Core/FileType";
import {useQuery} from "@tanstack/react-query";
import getFile from "../Api/Files/GetFile";

export const useFile = (fileId: string) => {
    const {data, error, isLoading} = useQuery({
        queryKey: ['api/GetFile', fileId],
        queryFn: async () => await getFile(fileId),
    });
    
    return {data, error, isLoading};
}