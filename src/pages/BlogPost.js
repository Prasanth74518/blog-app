import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Comment from '../components/CommentSection';
import ShareButtons from '../components/ShareButtons';
import { CATEGORIES } from '../constants/categories';

// Add getCategoryStyles function
const getCategoryStyles = (categoryName) => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  if (!category) return 'bg-gray-100 text-gray-700';
  return `${category.lightBg} ${category.text}`;
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, loading, fetchSinglePost, addComment, incrementViews } = useBlog();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [totalComments, setTotalComments] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  const existingPost = useMemo(() => posts.find(p => p.id === Number(id)), [id, posts]);

  useEffect(() => {
    if (existingPost) {
      setPost(existingPost);
      if (!hasIncrementedView) {
        incrementViews(Number(id));
        setHasIncrementedView(true);
      }
      return;
    }

    const fetchPost = async () => {
      try {
        const fetchedPost = await fetchSinglePost(id);
        setPost(fetchedPost);
        if (!hasIncrementedView) {
          incrementViews(Number(id));
          setHasIncrementedView(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      }
    };

    fetchPost();
  }, [id, existingPost, fetchSinglePost, navigate, incrementViews, hasIncrementedView]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        // Add timestamps to existing comments
        const commentsWithDates = data.map(comment => ({
          ...comment,
          createdAt: comment.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString()
        }));
        setComments(commentsWithDates);
        setTotalComments(data.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [id, post]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const newCommentObj = {
      id: Date.now(),
      email: 'user@example.com',
      body: newComment,
      createdAt: new Date().toISOString(),
      isNew: true,
      likes: 0,
      replies: []
    };

    try {
      setComments(prevComments => [newCommentObj, ...prevComments]);
      setTotalComments(prev => prev + 1);
      setNewComment('');
      
      const savedComment = await addComment(post.id, newCommentObj);
      
      // Update the temporary comment with the saved one
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === newCommentObj.id ? { ...savedComment, isNew: true } : comment
        )
      );

      setTimeout(() => {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === newCommentObj.id ? { ...comment, isNew: false } : comment
          )
        );
      }, 3000);

    } catch (error) {
      console.error('Error adding comment:', error);
      setComments(prevComments => prevComments.filter(c => c.id !== newCommentObj.id));
      setTotalComments(prev => prev - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Post not found!</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl animate-fadeIn dark:bg-gray-900">
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-300 
          hover:bg-gray-600 dark:hover:bg-gray-700 hover:shadow-md flex items-center gap-2"
      >
        <span>←</span> Back to Posts
      </button>
      
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Image Section */}
        {post.imageUrl && (
          <div className="relative h-[300px] md:h-[400px] overflow-hidden">
            <img 
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          {/* Post Meta Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Date */}
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {/* Views Counter */}
              <span className="flex items-center text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {(post.views || 0).toLocaleString()} views
              </span>
            </div>
            {/* Share Button */}
            <ShareButtons post={post} />
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {post.title}
          </h1>

          {/* Post Content */}
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {post.body}
          </p>

          {/* Category Tag */}
          <div className="mt-8">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium 
              ${post.category ? getCategoryStyles(post.category) : 'bg-gray-100 text-gray-700'}`}>
              {post.category || 'General'}
            </span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <span>Comments</span>
          <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
            {totalComments}
          </span>
        </h2>

        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            className={`w-full p-4 border rounded-lg
              bg-gray-50 dark:bg-gray-700 
              text-gray-900 dark:text-gray-100
              border-gray-200 dark:border-gray-600
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition duration-200
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            placeholder={isSubmitting ? 'Adding comment...' : 'Write a comment...'}
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-lg 
              transition-all duration-200
              ${isSubmitting 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </span>
            ) : 'Add Comment'}
          </button>
        </form>
        
        {loadingComments ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {comments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
