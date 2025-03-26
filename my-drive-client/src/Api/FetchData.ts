import {axiosInstance} from "../index";

export async function FetchData<T = any>(apiUrl: string, params?: any) {
    try {
        let response = await axiosInstance.get<T>(apiUrl + `/${(params ? params : '')}`);
        return response.data;
    }
    catch(err){
        console.log("err", err);
    }
}