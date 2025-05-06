// import Login from "./pages/Login";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Profile from "./pages/Profile";
// import { useCallback, useEffect, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// import AgoraChat from "agora-chat";
// import Cookies from "js-cookie";
// import { useDispatch } from "react-redux";
// import { addMessage } from "./redux/reducers/chat.reducer";
// import { initializeClient } from "./redux/reducers/chatClient.reducer";
// import Register from "./pages/Register";
// import { Bounce, toast } from "react-toastify";
// import axios from "axios";
// import { logout } from "./redux/reducers/auth.reducer";
// import NotFound from "./pages/NotFound";

// const App = () => {

//   const chatClient = useRef(null);

//   const dispatch = useDispatch()

//   const handleLogout = () => {
//     Cookies.remove("agora_access_token");
//     Cookies.remove("auth_token");
//     Cookies.remove("username");
//     dispatch(logout())
//     chatClient.current.close();
//   };

//   useEffect(() => {
//     // Initializes the Web client.
//     chatClient.current = new AgoraChat.connection({
//       appKey: import.meta.env.VITE_AGORA_APP_KEY,
//       delivery: true,
//       read: true
//     });

//     if (Cookies.get("agora_access_token") && Cookies.get("username")) {
//       chatClient.current.open({
//         user: Cookies.get("username"),
//         // Use agoraToken for v1.2.1 and earlier, but accessToken for 1.2.2 and later.
//         accessToken: Cookies.get("agora_access_token"),
//       });
//     }

//     // dispatch(initializeClient(chatClient))
//   }, [])

//   const updateMessageStatus = useCallback((id, newStatus) => {
//     setChats(prev => {
//       const index = prev.findIndex(msg => msg.id === id);
//       if (index === -1) return prev; // No update needed

//       const updated = [...prev];
//       updated[index] = { ...updated[index], status: newStatus };
//       return updated;
//     });
//   }, []);

//   const handleAgoraLogin = async (userId, token) => {
//     if (userId && token) {
//       chatClient.current.open({
//         user: userId,
//         // Use agoraToken for v1.2.1 and earlier, but accessToken for 1.2.2 and later.
//         accessToken: token,
//       });

//       // toast.success("Login Successfully", {
//       //   position: "bottom-right",
//       //   autoClose: 1000,
//       //   hideProgressBar: false,
//       //   closeOnClick: false,
//       //   pauseOnHover: true,
//       //   draggable: true,
//       //   progress: undefined,
//       //   theme: "light",
//       //   transition: Bounce,
//       // });

//       return true
//     } else {
//       return false
//     }
//   };

//   const handleSendMessage = async (message, peerId, chats, setChat, setMessage) => {

//     try {
//       if (!message.trim()) {
//         return toast.info("Please enter message content", {
//           position: "bottom-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//         });
//       }

//       const userId = Cookies.get("username");
//       const options = {
//         chatType: "singleChat", // Sets the chat type as a one-to-one chat.
//         type: "txt", // Sets the message type.
//         to: peerId, // Sets the recipient of the message with user ID.
//         msg: message, // Sets the message content.
//         requireDeliveryAck: true
//       };

//       let msg = AgoraChat.message.create(options);

//       const payload = {
//         from: userId,
//         to: msg.to,
//         msg: msg.msg,
//         timestamp: msg.time,
//         type: msg.type
//       }

//       await chatClient.current.send(msg);
//       setMessage("")
//       await axios.post(`${import.meta.env.VITE_API_URL}/message`, payload);

//       // addLog(`${message}`);

//       setChat([...chats, { ...msg, status: "sent" }]);
//       dispatch(addMessage({ ...msg, status: "sent" }))

//       return {
//         success: true,
//         message: message
//       };

//     } catch (error) {

//       console.log(error, "my error");

//       toast.error(`Message send failed: ${error.message}`, {
//         position: "bottom-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });

//       return {
//         success: false,
//         message: null
//       };
//     }
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={<Login handleAgoraLogin={handleAgoraLogin} />}
//         />
//         <Route
//           path="/signup"
//           element={<Register />}
//         />
//         <Route
//           path="/profile"
//           element={<Profile handleSendMessage={handleSendMessage} chatClient={chatClient} handleLogout={handleLogout}/>}
//         />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App;




import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import { useEffect, useRef, useState } from "react";
import AgoraChat from "agora-chat";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addMessage } from "./redux/reducers/chat.reducer";
import Register from "./pages/Register";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import { login, logout } from "./redux/reducers/auth.reducer";
import NotFound from "./pages/NotFound";

const App = () => {
  const chatClient = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("auth_token");
      const username = Cookies.get("username");
      const agoraToken = Cookies.get("agora_access_token");
      
      if (token && username && agoraToken) {
        try {
          // Initialize chat client
          if (!chatClient.current) {
            initChatClient();
          }
          
          // Open connection with stored credentials
          await chatClient.current.open({
            user: username,
            accessToken: agoraToken,
          });
          
          dispatch(login());
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication failed:", error);
          handleLogout();
        }
      }
      
      setIsInitialized(true);
    };
    
    checkAuth();
  }, [dispatch]);

  const initChatClient = () => {
    // Initialize the chat client if not already initialized
    if (!chatClient.current) {
      chatClient.current = new AgoraChat.connection({
        appKey: import.meta.env.VITE_AGORA_APP_KEY,
        delivery: true,
        read: true
      });
    }
    return chatClient.current;
  };

  const handleLogout = () => {
    // Close connection if it exists
    if (chatClient.current) {
      try {
        chatClient.current.close();
      } catch (error) {
        console.error("Error closing chat connection:", error);
      }
    }
    
    // Clear cookies
    Cookies.remove("agora_access_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");
    
    // Update state
    dispatch(logout());
    setIsAuthenticated(false);
  };

  const handleAgoraLogin = async (userId, token) => {
    if (!userId || !token) return false;

    try {
      // Initialize chat client if needed
      if (!chatClient.current) {
        initChatClient();
      }

      // Open connection with new credentials
      await chatClient.current.open({
        user: userId,
        accessToken: token,
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Agora login failed:", error);
      toast.error(`Login failed: ${error.message}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return false;
    }
  };

  const handleSendMessage = async (message, peerId, chats, setChat, setMessage) => {
    try {
      if (!message.trim()) {
        toast.info("Please enter message content", {
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
        return { success: false, message: null };
      }

      const userId = Cookies.get("username");
      const options = {
        chatType: "singleChat",
        type: "txt",
        to: peerId,
        msg: message,
        requireDeliveryAck: true
      };

      // Create message
      let msg = AgoraChat.message.create(options);

      // Prepare payload for backend storage
      const payload = {
        from: userId,
        to: msg.to,
        msg: msg.msg,
        timestamp: msg.time,
        type: msg.type,
        status: "sent"
      };

      // Send message through Agora
      await chatClient.current.send(msg);
      
      // Clear input field
      setMessage("");
      
      // Store message in backend
      await axios.post(`${import.meta.env.VITE_API_URL}/message`, payload);

      // Update local state
      const newMsg = { ...msg, status: "sent" };
      setChat(prev => [...prev, newMsg]);
      dispatch(addMessage(newMsg));

      return {
        success: true,
        message: message
      };
    } catch (error) {
      console.error("Message send error:", error);
      toast.error(`Message send failed: ${error.message}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      return {
        success: false,
        message: null
      };
    }
  };

  // Show loading state while checking authentication
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Login handleAgoraLogin={handleAgoraLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile 
                handleSendMessage={handleSendMessage} 
                chatClient={chatClient} 
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;