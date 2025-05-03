import {axiosInstance} from "../../index";
import {type} from "node:os";

export const getFileBlobAsync = async (fileId: string): Promise<{blob: Blob, url: string, data: any,}> => {
	const response = await axiosInstance.get(`Files/GetFileStream/${fileId}`, {responseType: 'blob'});
    const blob = new Blob([response.data], {type: response.headers['content-type']});
    const url = URL.createObjectURL(blob);
    
    return {blob, url, data:response.data};
}