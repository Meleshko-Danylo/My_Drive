import { FileType } from "../../Core/FileType";
import { getFileBlobAsync } from "./GetFileStreamAsync";
import {downloadFileAsync} from "./DownloadFileAsync";


export async function openFileInNewTab(file: FileType): Promise<void> {
    try {
        if (file.contentType === 'application/pdf' ||
            file.contentType.includes('google-docs') ||
            file.contentType.includes('ms-word') ||
            file.contentType.includes('ms-excel') ||
            file.contentType.includes('ms-powerpoint') ||
            file.contentType.startsWith('image/')) {

            const { url } = await getFileBlobAsync(file.id);
            const newWindow = window.open(url, '_blank');

            if (newWindow) {
                newWindow.onbeforeunload = () => {
                    URL.revokeObjectURL(url);
                };
            } else {
                setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
            }
        }
        else if (file.contentType.startsWith('text/')) {
            const { url } = await getFileBlobAsync(file.id);
            const newWindow = window.open(url, '_blank');
            
            if (newWindow) {
                newWindow.onbeforeunload = () => {
                    URL.revokeObjectURL(url);
                };
            } else {
                setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
            }
        }
        else {
            await downloadFileAsync(file.id, file.name);
        }
    } catch (error) {
        console.error('Error opening file in new tab:', error);
        alert('Failed to open file. Please try again.');
    }
}