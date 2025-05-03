import React, {useEffect, useRef, useState} from 'react';
import {FileType} from "../Core/FileType";
import {GetFileContentAsync} from "../Api/Files/GetFileContentAsync";
import {downloadFileAsync} from "../Api/Files/DownloadFileAsync";
import {getFileBlobAsync} from "../Api/Files/GetFileStreamAsync";

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
            setLoading(true);
            setError(null);
            
            try {
                if(file.contentType.startsWith('text')){
                    setContent(await GetFileContentAsync(file));
                }
                else if(file.contentType.startsWith("image")){
                    const {url} = await getFileBlobAsync(file.id);
                    setContent(url);
                    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                }
                else if(file.contentType.startsWith("video")){
                    const {url} = await getFileBlobAsync(file.id);
                    setContent(url);
                    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                }
                else if(file.contentType === 'application/pdf'){
                    const {url} = await getFileBlobAsync(file.id);
                    const newWindow = window.open(url, '_blank');
                    if(newWindow){
                        newWindow.onbeforeunload = () => {
                            URL.revokeObjectURL(url);
                        }
                    }
                    else {
                        setContent(url);
                        setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                    }
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
                            (
                                file.contentType.startsWith('text') &&
                                (<pre className="file-preview-text">{content}</pre>)
                                || file.contentType.startsWith('image') &&
                                (<img src={content} alt={`${file.name}`} className="file-preview-image"/>)
                                || file.contentType.startsWith('video') && (
                                    <div className="file-preview-video-container">
                                        <video src={content} controls className="file-preview-video" autoPlay={false}>
                                            Your browser does not support the video tag.
                                        </video> 
                                    </div>
                                )
                                || file.contentType === 'application/pdf' &&
                                (<iframe src={content} title={`PDF preview of ${file.name}`}
                                         className="file-preview-pdf"/>)
                            ) :
                        <div className="file-preview-loading">Loading...</div>}
                </div>
            </div>
        </div>
    );
};

export default FIlePreviewPopUp;