import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
      <div className={`
        mx-4 p-6 rounded-xl shadow-2xl max-w-sm w-full
        ${type === 'success' ? 'bg-white' : 'bg-white'}
        transform animate-notification-pop
      `}>
        {/* Alert Icon and Message */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`
            ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
            p-3 rounded-full
          `}>
            {type === 'success' ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`
              mt-2 px-6 py-2 rounded-lg font-medium text-sm
              ${type === 'success' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'}
              transition-colors duration-200
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
