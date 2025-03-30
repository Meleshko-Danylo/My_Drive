import React from 'react';
import '../Styles/App.css';
import FoldersManager from "../Components/FoldersManager";
import FilesDisplayContainer from "../Components/FilesDisplayContainer";

function App() {
  return (
    <div className="App">
        <FoldersManager />
        <FilesDisplayContainer />
    </div>
  );
}

export default App;
