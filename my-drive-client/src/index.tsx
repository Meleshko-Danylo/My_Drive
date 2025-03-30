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
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/App" element={<App />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/" element={<LogIn />} />
            </Routes>
        </QueryClientProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
