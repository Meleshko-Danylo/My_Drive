import {axiosInstance} from "../../index";

export const downloadFolderAsync = async (folderId: string, folderName?: string) => {
    try {
        const response = await axiosInstance.get(`/Folders/DownloadFolder/${folderId}`, {
            responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { 
            type: 'application/zip' 
        });

        const downloadFileName = `${folderName || 'folder'}.zip`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFileName);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        return response.data;
    }
    catch(err) {
        console.error('Error downloading folder:', err);
        throw err;
    }
}