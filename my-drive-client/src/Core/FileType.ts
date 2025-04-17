export type FileType = {
    id: string,
    name: string,
    path: string,
    size: number,
    createdAt: Date,
    isAccessible: boolean,
    contentType: string,
    folderId: string
};

export type UploadFileDto = {
    file: File,
    fileId: string
    folderId: string
    isAccessible: boolean
}