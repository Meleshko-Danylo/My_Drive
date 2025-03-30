import {axiosInstance} from "../../index";

export const downloadFileAsync = async (fileId: string) => {
    try {
        // const response = await axiosInstance.get(`/files/${fileId}/download`, {responseType: 'blob'});
        const response = await axiosInstance.get(`/Files/DownloadFile/${fileId}`);
        return response.data;
    }
    catch(err) {
        console.error(err);
    }
}