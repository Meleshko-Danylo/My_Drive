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