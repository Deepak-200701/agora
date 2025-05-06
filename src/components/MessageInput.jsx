import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function MessageInput({ handleSendMessage, message, setMessage, chats, setChats }) {

  const [searchParams, setSeachParams] = useSearchParams();
  const [peerId, setPeerId] = useState("");

  useEffect(() => {
    const peerId = searchParams.get("user");
    setPeerId(peerId);
  }, [searchParams]);

  return (
    <div className="flex items-center p-6 bg-gray-100 border-t border-gray-300">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={() => handleSendMessage(message, peerId, chats, setChats, setMessage)}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
