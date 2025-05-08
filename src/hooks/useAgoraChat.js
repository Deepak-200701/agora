// src/hooks/useAgoraChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, addUnreadMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';
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

  const updateMessageStatusHandler = useCallback(async (messageId, newStatus) => {

    if (!["sent", "delivered", "read"].includes(status)) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/message`,
        { messageId: messageId, status: newStatus }
      )
    }

    setChats(prev => {
      const index = prev.findIndex(msg => msg.id === messageId);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });

    dispatch(updateMessageStatus({ id: messageId, status: newStatus }));
  }, [dispatch]);

  const initializeFromStorage = useCallback(async () => {
    const username = Cookies.get('username');
    const token = Cookies.get('agora_access_token');

    if (!username || !token) return false;

    try {
      setIsConnecting(true);
      await agoraService.connect(username, token);
      await agoraService.getConversationsList()
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


  const handleLogout = useCallback(() => {
    agoraService.disconnect();
    setIsConnected(false);

    // Clear cookies
    Cookies.remove("agora_access_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");

    dispatch(logout());
  }, [dispatch]);

  const sendMessage = useCallback(async (receiverId, text, setMessage) => {
    if (!isConnected) {
      toast.error("Not connected to chat service");
      return { success: false };
    }

    try {
      const senderId = Cookies.get("username");
      const message = await agoraService.sendMessage(senderId, receiverId, text);

      const payload = {
        messageId: message.id,
        from: senderId,
        to: message.to,
        msg: message.msg,
        timestamp: message.time,
        type: message.type,
        status: "sent"
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/message`, payload);

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


  const setUnreadMessage = (message) => {
    const unReadMessage = JSON.parse(localStorage.getItem("unReadMessage"));

    if (unReadMessage && unReadMessage.length) {
      const updatedMessages = [...unReadMessage, message];
      localStorage.setItem("unReadMessage", JSON.stringify(updatedMessages));
    } else {
      localStorage.setItem("unReadMessage", JSON.stringify([message]));
    }
  }

  const removeUnreadMessage = (msg) => {
    const unReadMessage = JSON.parse(localStorage.getItem("unReadMessage")) || [];
    const updatedMessages = unReadMessage.filter(message => message.id !== msg.id);
    localStorage.setItem("unReadMessage", JSON.stringify(updatedMessages));
  }

  const getUnReadMessages = () => {
    const unReadMessage = JSON.parse(localStorage.getItem("unReadMessage")) || [];
    return unReadMessage;
  }

  useEffect(() => {
    agoraService.initialize();

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

        const newMessage = { ...message, status: "received" };
        setChats(prev => [...prev, newMessage]);
        dispatch(addMessage(newMessage));
        if (message.from !== agoraService.recieverId) {
          setUnreadMessage(newMessage)
          // dispatch(addUnreadMessage(newMessage))
        }

        // Send read receipt
        agoraService.sendReadReceipt(message);
      },
      onDeliveredMessage: (message) => {
        console.log("Message delivered:", message);
        updateMessageStatusHandler(message.mid, "delivered");
      },
      onReadMessage: (message) => {
        console.log("Message read:", message);
        updateMessageStatusHandler(message.mid, "read");
      },
      onReceivedMessage: (message) => {
        // alert("read recieve")
        updateMessageStatusHandler(message.mid, "read");
      }
      // onChannelMessage: (message) => {
      //   // alert("fron chanel")
      //   // This is for read receipts
      //   if (message.type === "channel") {
      //     alert("t")
      //     // console.log("fron chanel", message);
      //     dispatch(addUnreadMessage(message))
      //     // updateMessageStatusHandler(message.id, "read");
      //   }
      // },
      // onError: (error) => {
      //   console.error("Agora chat error:", error);
      //   toast.error(`Chat error: ${error.message}`);
      // }
    };


    agoraService.addEventHandler(handlerId.current, handlers);

    initializeFromStorage();

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
    initializeFromStorage,
    setUnreadMessage,
    removeUnreadMessage,
    getUnReadMessages
  };
};
