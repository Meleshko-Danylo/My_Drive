import {axiosInstance} from "../../index";

const getFile = async (fileId: string) => {
    try {
        const response = await axiosInstance.get(`Files/GetFile/${fileId}`)
        return response.data;
    }
    catch(err){
        console.log(err);
    }
};

export default getFile;