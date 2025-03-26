import {useQuery} from "@tanstack/react-query";
import {FetchData} from "../Api/FetchData";

export function useFetchData<T = any>(apiUrl: string, params?: any) {
    const {data, isLoading, error} = useQuery({
        queryKey: ['fetch-data'],
        queryFn: () => params ? FetchData<T>(apiUrl, params) : FetchData<T>(apiUrl)
    });
    return {data, isLoading, error};
}