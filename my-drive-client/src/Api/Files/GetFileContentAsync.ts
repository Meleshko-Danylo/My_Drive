import {axiosInstance} from "../../index";
import {FileType} from "../../Core/FileType";

export async function GetFileContentAsync(file: FileType)
{
    const response = await axiosInstance.get(`Files/GetFileContent/${file.id}?contentType=${file.contentType}`);
    return response.data;
}