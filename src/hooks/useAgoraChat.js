// src/hooks/useAgoraChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';
import agoraService from '../services/agoraService';
import Cookies from 'js-cookie';
import { login, logout } from '../redux/reducers/auth.reducer';
import { toast } from 'react-toastify';
import axios from 'axios';

export const useAgoraChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chats, setChats] = useState([]);
  const handlerId = useRef(`chat_handler_${Date.now()}`);
  const dispatch = useDispatch();

  // Handle message status updates consistently
  const updateMessageStatusHandler = useCallback((messageId, newStatus) => {
    setChats(prev => {
      const index = prev.findIndex(msg => msg.id === messageId);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });

    dispatch(updateMessageStatus({ id: messageId, status: newStatus }));
  }, [dispatch]);

  // Initialize connection with stored credentials
  const initializeFromStorage = useCallback(async () => {
    const username = Cookies.get('username');
    const token = Cookies.get('agora_access_token');

    if (!username || !token) return false;

    try {
      setIsConnecting(true);
      await agoraService.connect(username, token);
      setIsConnected(true);
      dispatch(login());
      return true;
    } catch (error) {
      console.error("Failed to initialize from storage:", error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [dispatch]);

  // Handle login with new credentials
  const handleLogin = useCallback(async (username, token) => {
    if (!username || !token) return false;

    try {
      setIsConnecting(true);
      await agoraService.connect(username, token);
      setIsConnected(true);
      dispatch(login());
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(`Login failed: ${error.message}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [dispatch]);

  // Handle logout
  const handleLogout = useCallback(() => {
    agoraService.disconnect();
    setIsConnected(false);

    // Clear cookies
    Cookies.remove("agora_access_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");

    dispatch(logout());
  }, [dispatch]);

  // Send a message
  const sendMessage = useCallback(async (receiverId, text, setMessage) => {
    if (!isConnected) {
      toast.error("Not connected to chat service");
      return { success: false };
    }

    try {
      const senderId = Cookies.get("username");
      debugger
      const message = await agoraService.sendMessage(senderId, receiverId, text);


      const payload = {
        from: senderId,
        to: message.to,
        msg: message.msg,
        timestamp: message.time,
        type: message.type,
        status: "sent"
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/message`, payload);

      // Add message to local state with "sending" status
      const newMessage = { ...message, status: "sent" };
      setChats(prev => [...prev, newMessage]);
      dispatch(addMessage(newMessage));
      setMessage("")

      return { success: true, message: newMessage };
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(`Failed to send message: ${error.message}`);
      return { success: false };
    }
  }, [isConnected, dispatch]);

  // Setup event handlers when component mounts
  useEffect(() => {
    // Initialize Agora service first
    agoraService.initialize();

    // Set up event handlers
    const handlers = {
      onConnected: () => {
        console.log("Connected to Agora Chat");
        setIsConnected(true);
      },
      onDisconnected: () => {
        console.log("Disconnected from Agora Chat");
        setIsConnected(false);
      },
      onTextMessage: (message) => {
        console.log("Received message:", message);

        // Add received message to state
        const newMessage = { ...message, status: "received" };
        setChats(prev => [...prev, newMessage]);
        dispatch(addMessage(newMessage));

        // Send read receipt
        agoraService.sendReadReceipt(message);
      },
      onDeliveredMessage: (message) => {
        console.log("Message delivered:", message);
        updateMessageStatusHandler(message.mid, "delivered");
      },
      onReadMessage: (message) => {
        console.log("Message read:", message.mid);
        updateMessageStatusHandler(message.mid, "read");
      },
      // onChannelMessage: (message) => {
      //   // This is for read receipts
      //   if (message.type === "channel") {
      //     console.log("Read receipt received:", message);
      //     updateMessageStatusHandler(message.id, "read");
      //   }
      // },
      // onError: (error) => {
      //   console.error("Agora chat error:", error);
      //   toast.error(`Chat error: ${error.message}`);
      // }
    };

    // Add the event handler
    agoraService.addEventHandler(handlerId.current, handlers);

    // Try to initialize from storage on mount
    initializeFromStorage();

    // Clean up on unmount
    return () => {
      agoraService.removeEventHandler(handlerId.current);
    };
  }, [dispatch, initializeFromStorage, updateMessageStatusHandler]);

  return {
    isConnected,
    isConnecting,
    chats,
    setChats,
    sendMessage,
    handleLogin,
    handleLogout,
    initializeFromStorage
  };
};
