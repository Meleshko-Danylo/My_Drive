import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router";
import Register from "./Pages/Register";
import LogIn from "./Pages/LogIn";
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Folder from "./Pages/Folder";
import File from "./Pages/File";
import AuthContext from "./ContextLib/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    withCredentials: true
});

const queryClient = new QueryClient();

root.render(
    <BrowserRouter>
        <AuthContext>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/App/*" element={
                        <ProtectedRoute isForAdminOnly={true}>
                            <App />
                        </ProtectedRoute>
                    } />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/" element={<LogIn />} />
                    <Route path='/Folder/p/:folderId' element={<Folder />} />
                    <Route path="/File/p/:fileId" element={<File />} />
                    <Route path='/Home' element={<Home />}></Route>
                    <Route path='*' element={<div style={{display: 'flex', justifyContent:'center', alignItems:'center', 
                        height: '100vh', fontSize: '3rem', fontWeight: 'bold', width: '100%', color: '#fff'}}>404</div>} />
                </Routes>
            </QueryClientProvider>
        </AuthContext>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
