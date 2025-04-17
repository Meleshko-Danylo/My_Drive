import {axiosInstance} from "../../index";

export async function getFolderById<T = any>(id:string='/', setValue?: (value:T)=>void) {
    try {
        let response = await axiosInstance.get<T>(`/Folders/GetFolder/${id}`);
        if(setValue) setValue(response.data);
        return response.data;
    }
    catch(err){
        console.log("err", err);
    }
}