import React, { useState } from 'react';
import { Link } from 'react-router';
import '../Styles/Home.css';
import HomeHeader from '../Components/HomeHeader';

const Home = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        if (expandedFaq === index) {
            setExpandedFaq(null);
        } else {
            setExpandedFaq(index);
        }
    };

    return (
        <>
            <HomeHeader />
            <div className="home-container">
                <section className="hero-section">
                <h1 className="hero-title">Welcome to MyDrive</h1>
                <p className="hero-subtitle">
                    Your secure, personal cloud storage solution. Store, share, and access your files from anywhere, anytime.
                </p>
                <div className="cta-buttons">
                    <Link to="/login" className="cta-button primary-button">Get Started</Link>
                    <Link to="/Register" className="cta-button secondary-button">Create Account</Link>
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Key Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📁</div>
                        <h3 className="feature-title">File Management</h3>
                        <p className="feature-description">
                            Easily upload, organize, and manage your files with our intuitive interface. Create folders, move files, and keep everything organized.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3 className="feature-title">Secure Storage</h3>
                        <p className="feature-description">
                            Your files are encrypted and stored securely. Only you decide who can access your content.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔗</div>
                        <h3 className="feature-title">Easy Sharing</h3>
                        <p className="feature-description">
                            Share files and folders with others through secure links. Control access permissions for shared content.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3 className="feature-title">Access Anywhere</h3>
                        <p className="feature-description">
                            Access your files from any device with an internet connection. Your content is always available when you need it.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👁️</div>
                        <h3 className="feature-title">File Preview</h3>
                        <p className="feature-description">
                            Preview images, videos, PDFs, and text files directly in your browser without downloading them first.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3 className="feature-title">Version Control</h3>
                        <p className="feature-description">
                            Upload new versions of your files while maintaining access to previous versions when needed.
                        </p>
                    </div>
                </div>
            </section>

            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3 className="step-title">Create an Account</h3>
                            <p className="step-description">
                                Sign up for a free account using your email or Google account. Set up your profile and get started in seconds.
                            </p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3 className="step-title">Upload Your Files</h3>
                            <p className="step-description">
                                Upload files from your device to your secure cloud storage. Create folders to organize your content.
                            </p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3 className="step-title">Access and Share</h3>
                            <p className="step-description">
                                Access your files from any device. Share files with others by generating secure links with custom permissions.
                            </p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3 className="step-title">Collaborate and Manage</h3>
                            <p className="step-description">
                                Work together on shared files, manage versions, and keep track of all your content in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-container">
                    <div className="faq-item">
                        <div className="faq-question" onClick={() => toggleFaq(0)}>
                            <span>Is MyDrive free to use?</span>
                            <span>{expandedFaq === 0 ? '−' : '+'}</span>
                        </div>
                        {expandedFaq === 0 && (
                            <div className="faq-answer">
                                Yes, MyDrive offers a free tier with generous storage limits. Premium plans with additional features and storage are also available.
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={() => toggleFaq(1)}>
                            <span>How secure are my files?</span>
                            <span>{expandedFaq === 1 ? '−' : '+'}</span>
                        </div>
                        {expandedFaq === 1 && (
                            <div className="faq-answer">
                                Your files are encrypted during transfer and storage. We use industry-standard security protocols to ensure your data remains private and secure.
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={() => toggleFaq(2)}>
                            <span>Can I share files with people who don't have a MyDrive account?</span>
                            <span>{expandedFaq === 2 ? '−' : '+'}</span>
                        </div>
                        {expandedFaq === 2 && (
                            <div className="faq-answer">
                                Yes, you can share files with anyone by generating a public link. Recipients don't need a MyDrive account to access shared files.
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={() => toggleFaq(3)}>
                            <span>What file types can I upload?</span>
                            <span>{expandedFaq === 3 ? '−' : '+'}</span>
                        </div>
                        {expandedFaq === 3 && (
                            <div className="faq-answer">
                                MyDrive supports all common file types including documents, images, videos, audio files, PDFs, and more. There are no restrictions on file formats.
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <div className="faq-question" onClick={() => toggleFaq(4)}>
                            <span>How do I recover deleted files?</span>
                            <span>{expandedFaq === 4 ? '−' : '+'}</span>
                        </div>
                        {expandedFaq === 4 && (
                            <div className="faq-answer">
                                Deleted files are moved to the trash bin where they remain for 30 days before being permanently deleted. You can restore files from the trash at any time during this period.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>© 2023 MyDrive. All rights reserved.</p>
                <p>Your secure cloud storage solution.</p>
            </footer>
        </div>
        </>
    );
};

export default Home;