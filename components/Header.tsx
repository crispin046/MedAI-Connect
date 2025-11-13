import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SparkIcon } from './icons/SparkIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const SyncStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="flex items-center gap-1 text-sm font-medium">
           {isOnline ? 
             <CheckCircleIcon className="w-5 h-5 text-green-500" /> :
             <div className="w-4 h-4 rounded-full bg-gray-400 animate-pulse" />
            }
           <span className={`${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Synced' : 'Offline'}
           </span>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-teal-500 p-2 rounded-lg">
              <SparkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                MedAI <span className="text-teal-500">Connect</span>
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Smart Triage Assistant for Every Clinic.</p>
            </div>
          </Link>
           <div className="flex items-center gap-4">
                <SyncStatus />
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <BellIcon className="w-6 h-6" />
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                 <nav className="hidden md:flex items-center space-x-4">
                    <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>Home</NavLink>
                    <NavLink to="/triage" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>Triage</NavLink>
                    <NavLink to="/referrals" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>Referrals</NavLink>
                    <NavLink to="/analytics" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>Analytics</NavLink>
                    <NavLink to="/find-doctor" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>Find a Specialist</NavLink>
                    <NavLink to="/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}>About</NavLink>
                 </nav>
                <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm"
                aria-label="Select language"
                >
                <option>English</option>
                <option>Swahili</option>
                <option>French</option>
                <option>Yoruba</option>
                <option>Hausa</option>
                </select>
          </div>
        </div>
      </div>
    </header>
  );
};