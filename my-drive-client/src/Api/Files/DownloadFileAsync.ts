import {axiosInstance} from "../../index";

export const downloadFileAsync = async (fileId: string, fileName?: string) => {
    try {
        const response = await axiosInstance.get(`Files/DownloadFile/${fileId}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], {
            type: response.headers['content-type']
        });
        
        const downloadFileName = fileName || 'download';
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
        console.error('Error downloading file:', err);
        throw err;
    }
}