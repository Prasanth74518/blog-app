import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import ShareButtons from './ShareButtons';

const getCategoryStyles = (categoryName) => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  if (!category) return 'bg-gray-100 text-gray-700';
  return `${category.lightBg} ${category.text}`;
};

const Card = ({ post }) => {
  const truncate = (text, length) => {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden 
      transform-gpu transition-all duration-300 ease-out
      hover:-translate-y-2 
      hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] 
      dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)]
      active:translate-y-0 
      cursor-pointer touch-manipulation">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden group">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out
            group-hover:scale-110 transform-gpu"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 
          transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-4 sm:p-6 transform transition-transform duration-300">
        {/* Header with Date and Category */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${getCategoryStyles(post.category)}`}>
            {post.category || 'General'}
          </span>
        </div>

        {/* Title with subtle hover effect */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2
          transform-gpu transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {truncate(post.title, 60)}
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
          {truncate(post.body, 120)}
        </p>

        {/* Footer with Views, Share and Read More */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Views Counter */}
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {(post.views || 0).toLocaleString()} views
            </span>
            {/* Share Buttons */}
            <ShareButtons post={post} />
          </div>

          {/* Read More Link with hover effect */}
          <Link
            to={`/post/${post.id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium
              group/link transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Read More
            <svg 
              className="w-5 h-5 ml-1 transform transition-transform duration-300 
                group-hover/link:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;