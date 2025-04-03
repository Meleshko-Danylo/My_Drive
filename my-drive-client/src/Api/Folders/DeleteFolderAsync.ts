import {axiosInstance} from "../../index";

export const DeleteFolderAsync = async (folderId: string): Promise<void> => {
	try {
        const response = await axiosInstance.delete(`/Folders/DeleteFolder/${folderId}`);
    }
    catch(err){
        console.error("Delete folder error", err)
    }
}