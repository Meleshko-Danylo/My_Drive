import React, {useEffect, useRef, useState} from 'react';
import {FileType} from "../Core/FileType";
import {GetFileContentAsync} from "../Api/Files/GetFileContentAsync";
import {downloadFileAsync} from "../Api/Files/DownloadFileAsync";

type FIlePreviewPopUpProps = {
    file: FileType | null;
    onClose: () => void;
    onOpenInNewTabClick: (file: FileType) => void;
}

const FIlePreviewPopUp = ({file, onClose, onOpenInNewTabClick}: FIlePreviewPopUpProps) => {
    const [content, setContent] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOuterClick = (e: MouseEvent) => {
            if(popupRef.current && !popupRef.current.contains(e.target as Node)){
                onClose();
            }
        }
        
        document.addEventListener('mousedown', handleOuterClick);
        return () => document.removeEventListener('mousedown', handleOuterClick);
    }, [onClose]);

    useEffect(() => {
        const fetchFileContent = async () => {
            if(!file) return;
            try {
                if(file.contentType.startsWith('text')){
                    setLoading(true);
                    setError(null);
                    setContent(await GetFileContentAsync(file));
                }
            }
            catch (err){
                console.error('Error happened while fetching file content:', err);
                setError('Error happened while fetching file content:');
            }
            finally{
                setLoading(false);
            }
        }

        fetchFileContent();
    }, [file]);
    
    if (!file) return null;
    
    return (
        <div className="file-preview-overlay">
            <div ref={popupRef} className="file-preview-popup">
                <div className="file-preview-header">
                    <h3>{file.name}</h3>
                    <div className="file-preview-actions">
                        <button className="file-preview-openIn-newTab-btn"
                                onClick={() => file && onOpenInNewTabClick(file)}
                        >
                            Open in new tab
                        </button>
                        <button className="file-preview-download-btn" onClick={async () => await downloadFileAsync(file?.id, file?.name)}>Download</button>
                        <button className="file-preview-close-btn" onClick={onClose}>X</button>
                    </div>
                </div>
                <div className="file-preview-content">
                    {!loading ?
                        error ?
                            <div className="file-preview-error">{error}</div> :
                            <pre><code>{content}</code></pre> :
                        <div className="file-preview-loading">Loading...</div>}
                </div>
            </div>
        </div>
    );
};

export default FIlePreviewPopUp;