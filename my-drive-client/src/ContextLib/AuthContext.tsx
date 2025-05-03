import React, {ReactNode, useEffect, useState} from 'react';
import {User} from "../Core/User";
import {useNavigate} from "react-router";
import {axiosInstance} from "../index";

type AuthContextType = {
    user: any;
    loading: boolean;
    login:(form: {email: string, password: string})=>void;
    logout:()=>void;
    isAdmin: boolean;
    getCurrentUser: ()=>Promise<void>;
    loginWithGoogle: ()=>void;
}

const AuthContextProvider = React.createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
    const context = React.useContext(AuthContextProvider);
    if (!context) throw new Error('useAuthContext must be used within a AuthContextProvider');
    return context;
};

const AuthContext = ({children}:{children:ReactNode}) => {
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    
    const getCurrentUser = async() =>{
        try {
            setLoading(true);
            const response = await axiosInstance.get('/Auth/GetCurrentUser');
            setUser(response.data);
        }
        catch(error){
            setUser(null);
            navigate('/login');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }
    
    const login = async (form: {email: string, password: string}) => {
        try {
            const response = await axiosInstance.post("/Auth/Login", form);
            setUser(response.data);
            if(response.data.role !== "Admin") navigate('/home')
            navigate('/App');
        }
        catch(error){
            setUser(null);
            console.error(error);
        }
    }
    
    const logout = async () => {
        try {
            await axiosInstance.get("/Auth/Logout");
            setUser(null);
            navigate('/');
        }
        catch(error){
            console.error(error);
        }
    }
    
    const loginWithGoogle = () => {
        window.location.href = "/api/account/login/google?returnUrl=/App";
    };
    
    const isAdmin = user?.role === "Admin";
    
    return (
        <AuthContextProvider.Provider value={{login, logout, user, isAdmin, loading, getCurrentUser, loginWithGoogle}}>
            {children}
        </AuthContextProvider.Provider>
    );
};

export default AuthContext;