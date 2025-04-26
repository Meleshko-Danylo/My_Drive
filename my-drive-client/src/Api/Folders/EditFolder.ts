import {axiosInstance} from "../../index";
import {EditFolderDto} from "../../Core/Folder";

const editFolder = async (update: EditFolderDto) => {
    try {
        const response = await axiosInstance.put("Folders/UpdateFolder", update);
        return response.data;
    }
    catch (error){
        console.error(error);
    }
};

export default editFolder;