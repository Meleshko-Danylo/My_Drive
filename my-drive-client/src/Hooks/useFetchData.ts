import {useQuery} from "@tanstack/react-query";
import {FetchData} from "../Api/FetchData";
import {useState} from "react";

export function useFetchData<T = any>(apiUrl: string, params?: any) {
    const [fetchedData, setFetchedData] = useState<T>();
    
    const {data, isLoading, error} = useQuery({
        queryKey: [apiUrl, params],
        queryFn: () => params ? 
            FetchData<T>(apiUrl, setFetchedData, params) 
            : 
            FetchData<T>(apiUrl, setFetchedData)
    });
    return {data, isLoading, error, fetchedData, setFetchedData};
}