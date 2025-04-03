import {useQuery} from "@tanstack/react-query";
import {FetchData} from "../Api/FetchData";
import {useState} from "react";

export function useFetchData<T = any>(apiUrl: string, params: string = '/') {
    const [fetchedData, setFetchedData] = useState<T>();
    const {data, isLoading, error} = useQuery({
        queryKey: ['/Folders/GetFolder', params],
        queryFn: () => FetchData<T>(apiUrl, setFetchedData, params)
    });
    return {data, isLoading, error, fetchedData, setFetchedData};
}