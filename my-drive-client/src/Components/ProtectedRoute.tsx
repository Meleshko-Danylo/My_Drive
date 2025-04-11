import React, {ReactNode, useEffect} from 'react';
import {Link} from "react-router";
import {useAuthContext} from "../ContextLib/AuthContext";

type ProtectedRouteProps = {
    isForAdminOnly: boolean;
    children?: ReactNode;
}

const ProtectedRoute = ({isForAdminOnly = false, children}: ProtectedRouteProps ) => {
    const {loading, isAdmin, getCurrentUser} = useAuthContext();

    useEffect(() => {
        getCurrentUser();
    }, []);
    
    if(loading){return (<>Loading...</>)}
    
    if(isForAdminOnly && !isAdmin){
        return (
            <div style={{width:'100%', height:'100vh', display:'flex',flexDirection:'column' , justifyContent:'center', alignItems:'center'}}>
                <h1>Not available</h1>
                <Link to={'/'}>Login</Link>
            </div>
        );
    }
    
    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;