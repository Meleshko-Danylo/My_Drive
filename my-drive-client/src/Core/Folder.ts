export type Folder = {
    id: string,
    name: string,
    path: string,
    files: File[],
    subFolders: Folder[],
    isAccessible: boolean,
    createdAt: Date,
    size: number,
    parentFolderId: string | null,
};

export type CreateFolderDto = {
    id: string,
    name: string,
    path: string,
    isAccessible: boolean,
    parentFolderId: string
};

export type EditFolderDto = {
    id: string,
    name: string,
    path: string,
    isAccessible: boolean,
    parentFolderId: string
}

export type UploadFolderDto = {
    files: File[],
    isAccessible: boolean,
    parentFolderId: string
}