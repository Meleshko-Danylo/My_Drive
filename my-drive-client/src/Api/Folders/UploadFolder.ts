import {UploadFolderDto} from "../../Core/Folder";
import {axiosInstance} from "../../index";

const uploadFolder = async (folder: UploadFolderDto) => {
    try {
        const formData = new FormData();
        formData.append("parentFolderId", folder.parentFolderId)
        formData.append("isAccessible", String(folder.isAccessible))
        for(let i=0; i < folder.files.length; i++) {
            formData.append("files", folder.files[i], folder.files[i].webkitRelativePath)
        }
        
        const response = await axiosInstance.post("Folders/UploadFolder", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
    }
    catch (e) {
        console.error(e);
        throw e;
    }
};

export default uploadFolder;