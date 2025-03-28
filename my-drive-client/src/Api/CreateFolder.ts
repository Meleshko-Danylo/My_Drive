import {CreateFolderDto, Folder} from "../Core/Folder";
import {axiosInstance} from "../index";

export const CreateFolder = async (folder: Folder, name:string, e?:any) => {
    if(e) e.preventDefault();
    try {
        const newFolder:CreateFolderDto = ({
            name: name,
            path:folder.path+name+"/",
            isAccessible:false,
            parentFolderId:folder.id
        })
        const response = await axiosInstance.post("/Folders/CreateFolder", newFolder);
    }
    catch(err){
        console.error(err);
    }
}