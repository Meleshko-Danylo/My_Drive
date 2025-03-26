export type Folder = {
    name: string,
    fullPath: string,
    files: File[],
    subFolders: Folder[],
    isAccessible: boolean,
    createdAt: Date,
    size: number,
    parentFolderId: string | null
};