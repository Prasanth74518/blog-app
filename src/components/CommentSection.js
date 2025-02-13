import React, { useState } from 'react';

const formatDate = (date, isNew = false) => {
  if (isNew) return 'just now';

  try {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    if (diffYears === 1) return '1 year ago';
    return `${diffYears} years ago`;
  } catch (error) {
    return 'just now';
  }
};

const Comment = ({ comment, postId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = (e) => {
    e.preventDefault();
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div 
      className={`
        border-l-4 
        ${comment.isNew ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-blue-500'} 
        pl-4 mb-4 rounded-lg bg-white dark:bg-gray-800 p-4 
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {comment.email[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400">{comment.email}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {comment.isNew ? 'just now' : formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-200">{comment.body}</p>
          
          <div className="mt-2 flex items-center gap-4">
            {/* Remove the like button */}
            {/* <button 
              onClick={handleLike}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
            >
              👍 {comment.likes || 0}
            </button> */}
            {/* Remove the reply button */}
            {/* <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Reply
            </button> */}
          </div>

          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 border rounded-lg 
                  bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-gray-100 
                  border-gray-300 dark:border-gray-600
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition duration-200"
                placeholder="Write your reply..."
                rows="3"
                required
              />
              <div className="mt-3 flex gap-2">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 transition-colors"
                >
                  Reply
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 
                    text-gray-700 dark:text-gray-200 rounded-lg
                    hover:bg-gray-300 dark:hover:bg-gray-500 
                    transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4">
              {comment.replies.map(reply => (
                <div key={reply.id} 
                  className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 
                    py-2 px-3 rounded-r-lg
                    bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-sm">{reply.email}</h5>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{reply.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
