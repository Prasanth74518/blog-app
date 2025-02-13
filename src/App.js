import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import BlogPost from './pages/BlogPost';
import CreatePost from './pages/CreatePost';
import ThemeToggle from './components/ThemeToggle';

function App() {
  console.log('App rendered'); // Debug log
  return (
    <ThemeProvider>
      <BlogProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/create" element={<CreatePost />} />
            </Routes>
            <ThemeToggle />
          </div>
        </Router>
      </BlogProvider>
    </ThemeProvider>
  );
}

export default App;