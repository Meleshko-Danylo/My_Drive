import {axiosInstance} from "../../index";
import {UploadFileDto} from "../../Core/FileType";


export const uploadFileAsync = async ({file, folderId, isAccessible, fileId}: UploadFileDto) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("fileId", fileId);
		formData.append("folderId", folderId);
		formData.append("isAccessible", String(isAccessible));
		
		const response = await axiosInstance.post("Files/UploadFile", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});
		return response.data;	
	}
	catch(err){
		console.error(err);
	}
}