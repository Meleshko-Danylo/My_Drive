import {axiosInstance} from "../index";

export async function FetchData<T = any>(apiUrl:string, setValue?: (value:T)=>void, params:string='/') {
    try {
        let response = await axiosInstance.get<T>(apiUrl + `?path=${params}`);
        if(setValue) setValue(response.data);
        return response.data;
    }
    catch(err){
        console.log("err", err);
    }
}