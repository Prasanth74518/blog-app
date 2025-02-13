import React, { useEffect, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import Notification from '../components/Notification';
import Card from '../components/Card';
import { CATEGORIES } from '../constants/categories';
import Header from '../components/Header';
import '../styles/animations.css';

const HomePage = () => {
  const { posts, loading, error, fetchPosts, notification, clearNotification } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
    console.log('Current posts:', posts); // Debug log
  }, [posts, fetchPosts]);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Notification positioned in center */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Latest Articles Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most recent blog posts and stay updated with the latest trends
          </p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 p-2 relative">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 ease-in-out relative
                ${selectedCategory === 'all'
                  ? 'text-blue-600 before:absolute before:inset-0 before:bg-blue-100 dark:before:bg-blue-900/30 before:rounded-full before:-z-10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                }`}
            >
              All Posts
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200 ease-in-out relative
                  ${selectedCategory === category.name
                    ? 'text-blue-600 before:absolute before:inset-0 before:bg-blue-100 dark:before:bg-blue-900/30 before:rounded-full before:-z-10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 text-center py-8 animate-fadeIn">{error}</div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600 dark:text-gray-400">
                  No posts found in this category
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 
                animate-fadeIn">
                {filteredPosts.map(post => (
                  <Card 
                    key={post.id} 
                    post={post} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
