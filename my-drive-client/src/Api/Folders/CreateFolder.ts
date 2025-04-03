import {CreateFolderDto, Folder} from "../../Core/Folder";
import {axiosInstance} from "../../index";


export const CreateFolder = async (folder: CreateFolderDto):Promise<Folder> => {
    try {
        const newFolder:CreateFolderDto = ({
            name: folder.name,
            path:folder.path+folder.name+"/",
            isAccessible: folder.isAccessible,
            parentFolderId:folder.parentFolderId
        })
        const response = await axiosInstance.post("/Folders/CreateFolder", newFolder);
        return response.data;
    }
    catch(err){
        throw err;
    }
}