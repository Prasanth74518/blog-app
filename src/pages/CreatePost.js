import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { CATEGORIES } from '../constants/categories';

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost, showNotification } = useBlog();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.title.trim() || !formData.body.trim() || !formData.category) {
      setError('Title, content, and category are required');
      setIsLoading(false);
      return;
    }

    try {
      await addPost({
        title: formData.title.trim(),
        body: formData.body.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl || undefined
      });
      
      showNotification('Post created successfully!', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error:', err);
      showNotification('Failed to create post. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Create New Post
          </h1>
          
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} 
            className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-800 
              rounded-xl p-4 sm:p-6 shadow-lg">
            {/* Form fields */}
            <div className="grid gap-4 sm:gap-6">
              {/* Title field */}
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500
                    transition-all duration-200"
                  placeholder="Enter post title"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Category field */}
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
                  Cover Image
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg 
                  border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 
                  transition-colors duration-200">
                  <div className="space-y-2 text-center">
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 
                        dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="relative mt-4 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                        hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Content field */}
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">Content</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows="6"
                  className="w-full p-2 border dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your post content"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Simplified Action Buttons with Smooth Hover and Click Effects */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t dark:border-gray-700">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-md
                  bg-blue-600 text-white font-medium
                  transition-all duration-150
                  hover:bg-blue-700
                  active:bg-blue-800
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                    Creating Post...
                  </span>
                ) : (
                  'Create Post'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-md
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300 font-medium
                  transition-all duration-150
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  active:bg-gray-100 dark:active:bg-gray-600"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;