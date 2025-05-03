import {useSelectedFileContext} from "../Pages/PublicFilePage";
import {FileType} from "../Core/FileType";
import FileItem from "./FileItem";
import {downloadFileAsync} from "../Api/Files/DownloadFileAsync";

type PublicFileManagerProps = {
    publicFile: FileType;
};

const PublicFileManager = ({publicFile}: PublicFileManagerProps) => {
    const {selectedFile, setSelectedFile} = useSelectedFileContext();
    const handleSelectFile = (file: FileType) => {
        setSelectedFile(file);
    }

    return (
        <>
            <div className="folders-container">
                <div className="toolsBar">
                    <span>/</span>
                    <div className="toolsBar-buttons">
                        <button onClick={async ()=>{
                            try {
                                await downloadFileAsync(publicFile.id, publicFile.name);
                            } catch (error) {
                                console.error('Download failed:', error);
                                alert('Failed to download file. Please try again.');
                            }
                        }}
                                className="uploadFile">Download File</button>
                    </div>
                </div>
                <div className="insideDirectory">
                    <div style={{width:'100%'}}>
                        <FileItem data={publicFile}
                                  isPublic={true}
                                  onSelect={handleSelectFile}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicFileManager;