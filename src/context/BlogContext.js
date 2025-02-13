import React, { createContext, useReducer, useContext, useCallback, useState } from "react";
import { CATEGORIES } from '../constants/categories';  // Add this import

const BlogContext = createContext();

const initialState = {
  comments: [], // Ensure this is initialized as an empty array
  posts: [],
  loading: false,
  error: null,
  notification: null
};

const blogReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_POST":
      return { 
        ...state, 
        posts: [action.payload, ...state.posts], // Add new post at the beginning
        loading: false,
        error: null
      };
    case "SET_NOTIFICATION":
      return {
        ...state,
        notification: action.payload
      };
    case "CLEAR_NOTIFICATION":
      return {
        ...state,
        notification: null
      };
    case "ADD_COMMENT":
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    case "LIKE_COMMENT":
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === action.payload.commentId
                    ? { ...comment, likes: (comment.likes || 0) + 1 }
                    : comment
                )
              }
            : post
        )
      };
    case "ADD_REPLY":
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === action.payload.commentId
                    ? { 
                        ...comment, 
                        replies: [...(comment.replies || []), action.payload.reply]
                      }
                    : comment
                )
              }
            : post
        )
      };
    case "INCREMENT_VIEWS":
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload && !post.viewIncremented
            ? { ...post, views: (post.views || 0) + 1, viewIncremented: true }
            : post
        )
      };
    default:
      return state;
  }
};

export const BlogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const [comments, setComments] = useState({});

  const fetchPosts = useCallback(async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const postsWithImages = data.map(post => ({
        ...post,
        imageUrl: `https://picsum.photos/seed/${post.id}/800/400`,
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].name, // Add random category for demo
        views: Math.floor(Math.random() * 2000) // Add initial random views for demo
      }));
      dispatch({ type: "SET_POSTS", payload: postsWithImages });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const fetchSinglePost = useCallback(async (id) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      return {
        ...data,
        imageUrl: `https://picsum.photos/seed/${id}/800/400`
      };
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    dispatch({ 
      type: "SET_NOTIFICATION", 
      payload: { message, type } 
    });

    // Auto clear after 3 seconds
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, 3000);
  }, []);

  const addPost = useCallback(async (newPost) => {
    try {
      const postToCreate = {
        ...newPost,
        userId: 1,
        id: Date.now(),
        author: {
          name: "John Doe", // In a real app, get from user auth
          avatar: `https://ui-avatars.com/api/?name=John+Doe&background=random`,
          email: "john@example.com"
        },
        createdAt: new Date().toISOString(),
        imageUrl: newPost.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/400`
      };

      dispatch({ type: "ADD_POST", payload: postToCreate });
      showNotification('Post created successfully!', 'success');
      return postToCreate;
    } catch (error) {
      showNotification('Failed to create post. Please try again.', 'error');
      console.error('Error adding post:', error);
      throw error;
    }
  }, [showNotification]);

  const clearNotification = useCallback(() => {
    dispatch({ type: "CLEAR_NOTIFICATION" });
  }, []);

  const addComment = useCallback(async (postId, comment) => {
    try {
      // Simulate API call
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
        headers: {
          'Content-type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      const savedComment = await response.json();
      
      // Update comments in context
      setComments(prev => ({
        ...prev,
        [postId]: [savedComment, ...(prev[postId] || [])]
      }));

      return savedComment;
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }, []);

  const likeComment = useCallback((postId, commentId) => {
    dispatch({ 
      type: "LIKE_COMMENT", 
      payload: { postId, commentId }
    });
  }, []);

  const addReply = useCallback((postId, commentId, reply) => {
    const newReply = {
      id: Date.now(),
      ...reply,
      createdAt: new Date().toISOString()
    };
    dispatch({
      type: "ADD_REPLY",
      payload: { postId, commentId, reply: newReply }
    });
    return newReply;
  }, []);

  const incrementViews = useCallback((postId) => {
    // Check if the post exists and update only if found
    dispatch({ 
      type: "INCREMENT_VIEWS", 
      payload: postId 
    });
  }, []);

  const contextValue = {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    notification: state.notification,
    fetchPosts,
    addPost, // Ensure addPost is included here
    fetchSinglePost,
    clearNotification,
    addComment,
    likeComment,
    addReply,
    comments,
    showNotification,
    incrementViews
  };

  console.log('Context value:', contextValue); // Debug log

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};