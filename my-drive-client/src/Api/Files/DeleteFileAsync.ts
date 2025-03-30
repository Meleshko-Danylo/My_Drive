import {axiosInstance} from "../../index";

export const deleteFileAsync = async (fileId: string) => {
    try {
        await axiosInstance.delete(`/Files/DeleteFile/${fileId}`);
    }   
    catch(err){
        console.error("error", err)
    }
}