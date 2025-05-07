// src/components/MessageList.js
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message}
              isOwn={message.from === currentUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;