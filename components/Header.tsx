
import React, { useState } from 'react';
import TargetIcon from './icons/TargetIcon';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { Page } from '../App';

interface HeaderProps {
    onClearProfile: () => void;
    currentPage: Page;
    setPage: (page: Page) => void;
}

const NavButton: React.FC<{
    page: Page;
    currentPage: Page;
    setPage: (page: Page) => void;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ page, currentPage, setPage, children, isMobile = false }) => {
    const isActive = currentPage === page;
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";
    const mobileClasses = "block text-base";
    const activeClasses = 'bg-primary text-background';
    const inactiveClasses = 'text-text-secondary hover:bg-secondary hover:text-text-primary';

    return (
        <button
            onClick={() => setPage(page)}
            className={`${baseClasses} ${isMobile ? mobileClasses : ''} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ onClearProfile, currentPage, setPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleSetPage = (page: Page) => {
        setPage(page);
        setIsMenuOpen(false);
    }

    return (
        <header className="bg-card shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <TargetIcon className="w-8 h-8 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                    Gemini Fitness Pal
                </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
                <NavButton page="dashboard" currentPage={currentPage} setPage={handleSetPage}>Dashboard</NavButton>
                <NavButton page="progress" currentPage={currentPage} setPage={handleSetPage}>Progress</NavButton>
                <NavButton page="history" currentPage={currentPage} setPage={handleSetPage}>History</NavButton>
                <NavButton page="workouts" currentPage={currentPage} setPage={handleSetPage}>Workout Library</NavButton>
                <NavButton page="coach" currentPage={currentPage} setPage={handleSetPage}>AI Coach</NavButton>
                <NavButton page="settings" currentPage={currentPage} setPage={handleSetPage}>Settings</NavButton>
            </nav>

            <div className="hidden md:block">
                 <button
                    onClick={onClearProfile}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Reset Profile
                </button>
            </div>

            {/* Mobile Nav Button */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-card shadow-lg z-10 p-4">
                    <nav className="flex flex-col gap-4">
                        <NavButton page="dashboard" currentPage={currentPage} setPage={handleSetPage} isMobile>Dashboard</NavButton>
                        <NavButton page="progress" currentPage={currentPage} setPage={handleSetPage} isMobile>Progress</NavButton>
                        <NavButton page="history" currentPage={currentPage} setPage={handleSetPage} isMobile>History</NavButton>
                        <NavButton page="workouts" currentPage={currentPage} setPage={handleSetPage} isMobile>Workout Library</NavButton>
                        <NavButton page="coach" currentPage={currentPage} setPage={handleSetPage} isMobile>AI Coach</NavButton>
                        <NavButton page="settings" currentPage={currentPage} setPage={handleSetPage} isMobile>Settings</NavButton>
                        <button
                            onClick={onClearProfile}
                            className="w-full text-left text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 mt-2"
                        >
                            Reset Profile
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
