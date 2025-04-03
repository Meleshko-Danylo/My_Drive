import {axiosInstance} from "../../index";

export type UploadFileDto = {
	file: File,
	folderId: string
	isAccessible: boolean
}

export const uploadFileAsync = async ({file, folderId, isAccessible}: UploadFileDto) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
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