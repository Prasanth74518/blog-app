const formatPostDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const postDate = new Date(date);
  const diffTime = Math.abs(now - postDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    const hours = Math.ceil(diffTime / (1000 * 60 * 60));
    return hours < 1 ? 'Just now' : `${hours} hours ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  return postDate.toLocaleDateString('en-US', options);
};

export default formatPostDate;
