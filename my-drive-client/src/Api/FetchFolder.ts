import {axiosInstance} from "../index";

export async function FetchFolder<T = any>(path:string='/', setValue?: (value:T)=>void) {
    try {
        let response = await axiosInstance.get<T>(`/Folders/GetFolder?path=${path}`);
        if(setValue) setValue(response.data);
        return response.data;
    }
    catch(err){
        console.log("err", err);
    }
}