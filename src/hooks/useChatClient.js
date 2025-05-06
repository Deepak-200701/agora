import { useEffect, useRef, useState, useCallback } from "react";
import { initializeChatClient, createTextMessage, sendReadReceipt } from "../services/chatService";
import { formatLogEntry } from "../utils/logger";

export function useChatClient(setLogs) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const chatClient = useRef(null);

  // Track message status
  const messageStatus = useRef(new Map());

  // Initialize chat client
  useEffect(() => {
    chatClient.current = initializeChatClient({
      onConnected: (user) => {
        setIsLoggedIn(true);
        setUserId(user);
        addLog(`Connected successfully as ${user}`, "success");
      },
      onDisconnected: () => {
        setIsLoggedIn(false);
        addLog("Disconnected from chat server", "system");
      },
      onTextMessage: (message) => {
        // Store the received message
        setMessages(prev => [...prev, {
          id: message.id,
          from: message.from,
          to: message.to,
          text: message.msg,
          timestamp: message.ext?.timestamp || Date.now(),
          status: 'received',
          isRead: false
        }]);
        
        // Send read receipt after a small delay to simulate user reading
        setTimeout(() => {
          sendReadReceipt(chatClient.current, message);
        }, 1000);
        
        addLog(`${message.from}: ${message.msg}`, "received");
      },
      onTokenWillExpire: () => {
        addLog("Warning: Token is about to expire", "warning");
      },
      onTokenExpired: () => {
        addLog("Error: Token has expired", "error");
      },
      onError: (error) => {
        addLog(`Error: ${error.message}`, "error");
      },
      // Handle message delivery status
      onMessageDelivered: (message) => {
        updateMessageStatus(message.id, 'delivered');
        addLog(`Message delivered to ${message.to}`, "status");
      },
      // Handle message read status
      onMessageRead: (message) => {
        updateMessageStatus(message.id, 'read');
        addLog(`Message read by ${message.to}`, "status");
      },
      // General receipt handler
      onReceipt: (receipt) => {
        if (receipt.type === 'delivery') {
          addLog(`Message ${receipt.id} delivered to ${receipt.to}`, "status");
        } else if (receipt.type === 'read') {
          addLog(`Message ${receipt.id} read by ${receipt.to}`, "status");
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chatClient.current) {
        chatClient.current.close();
      }
    };
  }, []);
  
  // Update message status in our tracker
  const updateMessageStatus = useCallback((messageId, status) => {
    // Update the message status map
    messageStatus.current.set(messageId, status);
    
    // Update messages array with new status
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status, isRead: status === 'read' } 
          : msg
      )
    );
  }, []);

  // Handle login
  const handleLogin = useCallback((user, token) => {
    if (!user || !token) {
      addLog("Please enter both user ID and token", "error");
      return false;
    }

    chatClient.current.open({
      user: user,
      accessToken: token,
    });
    
    setUserId(user);

    return true;
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (chatClient.current) {
      chatClient.current.close();
    }
    setIsLoggedIn(false);
    setUserId("");
    setMessages([]);
    messageStatus.current.clear();
  }, []);

  // Send message
  const sendMessage = useCallback(async (peerId, messageText) => {
    if (!peerId.trim() || !messageText.trim()) {
      addLog("Please enter both recipient ID and message", "error");
      return;
    }

    try {
      const message = createTextMessage(peerId, messageText);
      
      // Store the message before sending
      const newMessage = {
        id: message.id,
        from: userId,
        to: peerId,
        text: messageText,
        timestamp: Date.now(),
        status: 'sending',
        isRead: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Send the message
      await chatClient.current.send(message);
      
      // Update status to sent
      updateMessageStatus(message.id, 'sent');
      addLog(`To ${peerId}: ${messageText}`, "sent");
    } catch (error) {
      addLog(`Failed to send message: ${error.message}`, "error");
    }
  }, [userId, updateMessageStatus]);

  // Add log entry
  const addLog = useCallback((message, type = "system") => {
    setLogs(prevLogs => [...prevLogs, formatLogEntry(message, type)]);
  }, [setLogs]);

  return {
    isLoggedIn,
    userId,
    messages,
    handleLogin,
    handleLogout,
    sendMessage,
    addLog,
    getMessageStatus: (messageId) => messageStatus.current.get(messageId) || 'unknown'
  };
}