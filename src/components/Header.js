import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Blog Name */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Blog</span>
          </Link>

          {/* Desktop Navigation with Enhanced Create Button */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="header-link text-gray-700 dark:text-gray-200">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200
                hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                <span>Create</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1
                opacity-0 group-hover:opacity-100 invisible group-hover:visible
                transition-all duration-200 transform origin-top-right
                group-hover:translate-y-0 translate-y-[-10px]">
                <Link
                  to="/create"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 4v16m8-8H4" />
                  </svg>
                  New Post
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/"
                className="header-link px-4 py-2 text-gray-700 dark:text-gray-200"
              >
                Home
              </Link>
              <Link 
                to="/create"
                className="header-link px-4 py-2 text-gray-700 dark:text-gray-200"
              >
                Create Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
