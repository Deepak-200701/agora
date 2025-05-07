import React from 'react';

const MessageItem = ({ message, isOwn }) => {
  // Determine status icon based on message status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <span className="text-gray-400">⌛</span>;
      case 'sent':
        return <span className="text-gray-400">✓</span>;
      case 'delivered':
        return <span className="text-blue-500">✓✓</span>;
      case 'read':
        return <span className="text-green-500">✓✓</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm break-words">{message.msg}</span>
          <div className={`text-xs mt-1 flex items-center ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="mr-1">
              {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOwn && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
