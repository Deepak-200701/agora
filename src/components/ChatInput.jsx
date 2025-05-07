import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isConnected }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-300 p-4">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-blue-500"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className={`ml-2 bg-blue-500 text-white rounded-full p-2 ${
            !message.trim() || !isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
