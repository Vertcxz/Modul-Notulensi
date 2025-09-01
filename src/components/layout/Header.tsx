
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const HeaderNavLink: React.FC<{ to: string; text: string }> = ({ to, text }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                isActive
                    ? 'border-primary-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100'
            }`
        }
    >
        {text}
    </NavLink>
);


const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext not found');
  }

  const { user, logout } = authContext;

  return (
    <header className="relative bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/50 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Left-side: Hamburger menu (mobile) */}
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          {/* Center: Navigation Links (visible on all screens) */}
          <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-2 sm:space-x-4">
                  <HeaderNavLink to="/" text="Dashboard" />
                  <HeaderNavLink to="/action-plans" text="Action Plans" />
                  <HeaderNavLink to="/archive" text="Archive" />
              </div>
          </div>

          {/* Right-side: Profile dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="ml-3 relative">
              <div>
                <button onClick={() => setProfileOpen(!profileOpen)} className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" id="user-menu" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={user?.avatar} alt="" />
                </button>
              </div>
              {profileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-bold">{user?.name}</div>
                  <div className="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-600 mb-1">{user?.role}</div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Your Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Settings</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
