import React from 'react';
import { Link } from 'react-router';
import '../Styles/HomeHeader.css';

const HomeHeader = () => {
    return (
        <header className="home-header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-text">MyDrive</span>
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/Register" className="nav-link">Register</Link>
                </nav>
            </div>
        </header>
    );
};

export default HomeHeader;