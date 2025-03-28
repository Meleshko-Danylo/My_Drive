import React from 'react';

const FilesDisplayContainer = () => {
    return (
        <div className="files-representation-container">
            <div className="toolsBar">
                <span></span>
                <div className="toolsBar-buttons">
                    <button className="addFolder"></button>
                    <button className="uploadFile"></button>
                </div>
            </div>
            <div className="representation-wrapper">

            </div>
        </div>
    );
};

export default FilesDisplayContainer;