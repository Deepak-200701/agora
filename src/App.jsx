import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import AgoraChat from "agora-chat";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addMessage } from "./redux/reducers/chat.reducer";
import { initializeClient } from "./redux/reducers/chatClient.reducer";
import Register from "./pages/Register";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { logout } from "./redux/reducers/auth.reducer";

const App = () => {

  const chatClient = useRef(null);

  const dispatch = useDispatch()

  const handleLogout = () => {
    Cookies.remove("agora_access_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");
    dispatch(logout())
    chatClient.current.close();
  };

  useEffect(() => {
    // Initializes the Web client.
    chatClient.current = new AgoraChat.connection({
      appKey: import.meta.env.VITE_AGORA_APP_KEY,
      delivery: true,
      read: true
    });

    if (Cookies.get("agora_access_token") && Cookies.get("username")) {
      chatClient.current.open({
        user: Cookies.get("username"),
        // Use agoraToken for v1.2.1 and earlier, but accessToken for 1.2.2 and later.
        accessToken: Cookies.get("agora_access_token"),
      });
    }

    // dispatch(initializeClient(chatClient))
  }, [])

  const updateMessageStatus = useCallback((id, newStatus) => {
    setChats(prev => {
      const index = prev.findIndex(msg => msg.id === id);
      if (index === -1) return prev; // No update needed

      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
  }, []);

  const handleAgoraLogin = async (userId, token) => {
    if (userId && token) {
      chatClient.current.open({
        user: userId,
        // Use agoraToken for v1.2.1 and earlier, but accessToken for 1.2.2 and later.
        accessToken: token,
      });

      // toast.success("Login Successfully", {
      //   position: "bottom-right",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: false,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Bounce,
      // });

      return true
    } else {
      return false
    }
  };

  const handleSendMessage = async (message, peerId, chats, setChat, setMessage) => {

    try {
      if (!message.trim()) {
        return toast.info("Please enter message content", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      const userId = Cookies.get("username");
      const options = {
        chatType: "singleChat", // Sets the chat type as a one-to-one chat.
        type: "txt", // Sets the message type.
        to: peerId, // Sets the recipient of the message with user ID.
        msg: message, // Sets the message content.
        requireDeliveryAck: true
      };

      let msg = AgoraChat.message.create(options);

      const payload = {
        from: userId,
        to: msg.to,
        msg: msg.msg,
        timestamp: msg.time,
        type: msg.type
      }

      await chatClient.current.send(msg);
      setMessage("")
      await axios.post(`${import.meta.env.VITE_API_URL}/message`, payload);

      // addLog(`${message}`);

      setChat([...chats, { ...msg, status: "sent" }]);
      dispatch(addMessage({ ...msg, status: "sent" }))

      return {
        success: true,
        message: message
      };

    } catch (error) {

      console.log(error, "my error");

      toast.error(`Message send failed: ${error.message}`, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      return {
        success: false,
        message: null
      };
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login handleAgoraLogin={handleAgoraLogin} />}
        />
        <Route
          path="/signup"
          element={<Register />}
        />
        <Route
          path="/profile"
          element={<Profile handleSendMessage={handleSendMessage} chatClient={chatClient} handleLogout={handleLogout}/>}
        />
      </Routes>
    </Router>
  )
}

export default App;