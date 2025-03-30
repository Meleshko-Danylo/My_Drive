import {axiosInstance} from "../../index";

export type UpdateFileDto = {
  fileId: string;
  name?: string;
  isAccessible?: boolean;
  folderId?: string;
};

export const updateFileAsync = async (update: UpdateFileDto) => {
    try {
        const response = await axiosInstance.put("Files/UpdateFile", update);
        return response.data;
    }   
    catch(err){
        console.error(err)
    }
}