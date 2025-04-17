import React from 'react';
import {useAuthContext} from "../ContextLib/AuthContext";

const Header = () => {
    const {logout} = useAuthContext();
    return (
        <div className="Header">
            <button className="logout-button" onClick={() => logout()}>Logout</button>
        </div>
    );
};

export default Header;