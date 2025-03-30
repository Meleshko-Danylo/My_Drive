import {axiosInstance} from "../../index";

export type UploadFileDto = {
	file: File,
	folderId: string
}

export const uploadFileAsync = async ({file, folderId}: UploadFileDto) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("folderId", folderId);
	try {
		const response = await axiosInstance.post("Files/UploadFile", formData);
		return response.data;	
	}
	catch(err){
		console.error(err);
	}
}