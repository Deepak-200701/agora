// import React, { useEffect, useState } from 'react';
// import MessageBubble from './MessageBubble';
// import MessageInput from './MessageInput';
// import { useDispatch, useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import { addMessage, clearMessages, initialMessages } from '../redux/reducers/chat.reducer';
// import { Bounce, toast } from 'react-toastify';

// function ChatWindow({ chats = [], handleSendMessage, setChats, handleLogout }) {
//   const API_URL = import.meta.env.VITE_API_URL

//   const [message, setMessage] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [isUsersLoading, setIsIsersLoading] = useState(false)
//   const [name, setName] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientAvatar, setRecipientAvatar] = useState("");
//   const username = Cookies.get("username");
//   // console.log(users, "check");


//   const [searchParams, setSeachParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [peerId, setPeerId] = useState("");
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!searchParams.get("user") && users && users?.length) {
//       searchParams.append("user", users[0]?.username)
//       setSeachParams(searchParams);
//     }
//   }, [users])

//   useEffect(() => {
//     if (!users?.length || !name) {
//       fetchMe();
//       fetchUser()
//     }
//   }, []);

//   useEffect(() => {
//     if (peerId) {
//       fetchRecipient()
//       fetchMessages()
//     }
//   }, [peerId])

//   useEffect(() => {
//     const peerId = searchParams.get("user");
//     setPeerId(peerId);
//   }, [searchParams]);

//   const onLogout = () => {
//     handleLogout()
//     navigate("/")
//   }

//   const fetchMe = async () => {
//     try {
//       const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/metadata?username=${username}`);

//       setName(data?.data?.name)
//       setAvatar(data?.data?.avatar_url)
//     } catch (error) {
//       toast.error(error.message, {
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
//     }
//   }

//   const fetchRecipient = async () => {
//     try {
//       const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/metadata?username=${peerId}`);

//       // setRecipientName(data?.data?.data?.nickname)
//       // setRecipientAvatar(data?.data?.data?.avatarurl)

//       setRecipientName(data?.data?.name)
//       setRecipientAvatar(data?.data?.avatar_url)
//     } catch (error) {
//       toast.error(error.message, {
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
//     }
//   }

//   const fetchUser = async () => {
//     try {
//       setIsIsersLoading(true);
//       const { data } = await axios.get(`${API_URL}/user?username=${username}`);
//       setUsers([...data?.data]);
//     }
//     catch (error) {
//       console.log(error);
//     }
//     finally {
//       setIsIsersLoading(false);
//     }
//   }

//   const fetchMessages = async () => {
//     try {
//       const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/message?from=${username}&to=${peerId}`);

//       console.log([...chats, ...data.data], "my msg");
//       dispatch(clearMessages())

//       if (data?.data?.length) {
//         setChats((prev) => [...data?.data]);
//         dispatch(initialMessages(data.data))
//       }


//       // setRecipientName(data?.data?.name)
//       // setRecipientAvatar(data?.data?.avatar_url)
//     } catch (error) {
//       toast.error(error.message, {
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
//     }
//   }

//   const onSelectUser = (userId) => {
//     const isAvailable = searchParams.get("user")

//     if (isAvailable) {
//       searchParams.delete("user");
//       searchParams.append("user", userId);
//       setSeachParams(searchParams);
//     }
//     else {
//       searchParams.append("user", userId);
//       setSeachParams(searchParams);
//     }
//     setSelectedUser(userId)
//   }

//   const reduxChat = useSelector(state => state.chats);
//   const user = Cookies.get("username");

//   console.log(reduxChat, "redux");


//   console.log(reduxChat, "chating");

//   const formatTimestamp = (ms) => {
//     const date = new Date(ms);
//     const now = new Date();

//     const isToday = date.toDateString() === now.toDateString();

//     const yesterday = new Date();
//     yesterday.setDate(now.getDate() - 1);
//     const isYesterday = date.toDateString() === yesterday.toDateString();

//     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     if (isToday) return `${time}`;
//     if (isYesterday) return `Yesterday at ${time}`;

//     return date.toLocaleDateString() + ' at ' + time;
//   }

//   return (
//     // <div className="flex flex-col flex-1 w-full m-[-1px]">
//     //   <div className='w-full bg-blue-600 h-10'></div>
//     //   {/* <div className="flex-1 p-4 overflow-y-auto space-y-2">
//     //     {
//     //       reduxChat && reduxChat.length > 0 && reduxChat.map((chat, index) => {
//     //         return (
//     //           <MessageBubble key={index} text={chat} sender={index % 2 === 0 ? "other" : "me"} />
//     //         )
//     //       })
//     //     }
//     //   </div> */}

//     //   <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-gray-50">
//     //     {reduxChat.map((msg) => (
//     //       <div key={msg?.id} className={`flex ${msg?.to !== user ? "justify-end" : "justify-start"}`}>
//     //         <div className="flex items-end space-x-2 max-w-md">
//     //           {msg?.from !== "You" && (
//     //             <img
//     //               src={msg?.avatar}
//     //               alt={msg?.from}
//     //               className="w-8 h-8 rounded-full"
//     //             />
//     //           )}
//     //           <div
//     //             className={`p-3 rounded-lg text-sm ${msg?.to !== user
//     //               ? "bg-blue-500 text-white"
//     //               : "bg-gray-200 text-gray-900"
//     //               }`}
//     //           >
//     //             <div className="font-semibold mb-1">{msg?.from}</div>
//     //             <div>{msg?.msg}</div>
//     //             <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
//     //               <span>{formatTimestamp(msg?.time)}</span>
//     //               {msg?.to !== user && (
//     //                 <span className="ml-2 capitalize">✓ {msg?.status}</span>
//     //               )}
//     //             </div>
//     //           </div>
//     //           {msg?.to !== user && (
//     //             <img
//     //               src={msg?.avatar}
//     //               alt={msg?.from}
//     //               className="w-8 h-8 rounded-full"
//     //             />
//     //           )}
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>
//     //   <MessageInput
//     //     handleSendMessage={handleSendMessage}
//     //     message={message}
//     //     setMessage={setMessage}
//     //     chats={chats}
//     //     setChats={setChats}
//     //   />
//     // </div>

//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-screen">
//         {/* Fixed Header */}
//         <div className="mb-4 flex gap-2 items-center">
//           <img
//             src={avatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"}
//             alt={name}
//             className="w-10 h-10 rounded-full"
//           />
//           <p className="text-xl font-bold capitalize">{name}</p>
//         </div>

//         {/* Scrollable User List */}
//         <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
//           {users && users.length ? (
//             users.map((user) => (
//               <div
//                 key={user.username}
//                 onClick={() => onSelectUser(user.username)}
//                 className={`p-2 rounded cursor-pointer capitalize ${user.username === searchParams.get("user") ? 'bg-gray-700' : ""
//                   }`}
//               >
//                 {user.name}
//               </div>
//             ))
//           ) : null}
//         </div>
//       </div>


//       {/* Chat Area */}
//       <div className="flex flex-col flex-1">
//         {/* Header */}
//         <div className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
//           <div className="font-semibold text-lg capitalize flex items-center gap-2">
//             <img
//               src={recipientAvatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"}
//               alt={recipientName}
//               className="w-8 h-8 rounded-full"
//             />
//             {recipientName}
//           </div>
//           <button className="bg-slate-600 px-3 py-2 text-sm text-white" onClick={onLogout}>Logout</button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-gray-50">
//           {reduxChat.length ? reduxChat.map((msg) => (
//             <div key={msg?.id} className={`flex ${msg?.to !== user ? "justify-end" : "justify-start"}`}>
//               <div className="flex items-end space-x-2 max-w-md">
//                 {/* {msg?.to !== user && (
//                     <img
//                       src={msg?.avatar}
//                       alt={msg?.from}
//                       className="w-8 h-8 rounded-full"
//                     />
//                   )} */}
//                 <div
//                   className={`p-3 rounded-lg text-sm ${msg?.to !== user
//                     ? "bg-blue-500 text-white"
//                     : "bg-[#606c7e] text-white"
//                     }`}
//                 >
//                   {/* <div className="font-semibold mb-1">{msg?.from}</div> */}
//                   <div>{msg?.msg}</div>
//                   <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
//                     <span>{formatTimestamp(msg?.time || msg?.timestamp)}</span>
//                     {msg?.to !== user && (
//                       <span className="ml-2 capitalize">{msg?.status}</span>
//                     )}
//                   </div>
//                 </div>
//                 {/* {msg?.to !== user && (
//                     <img
//                       src={msg?.avatar}
//                       alt={msg?.from}
//                       className="w-8 h-8 rounded-full"
//                     />
//                   )} */}
//               </div>
//             </div>
//           )) : <></>}
//         </div>

//         {/* Input */}
//         <div className="p-4 border-t bg-white flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage(message, peerId, chats, setChats, setMessage)}
//           />
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={() => handleSendMessage(message, peerId, chats, setChats, setMessage)}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;



import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { addMessage, clearMessages, initialMessages } from '../redux/reducers/chat.reducer';
import { Bounce, toast } from 'react-toastify';

function ChatWindow({ chats = [], handleSendMessage, setChats, handleLogout }) {
  const API_URL = import.meta.env.VITE_API_URL;

  // State management
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAvatar, setRecipientAvatar] = useState("");
  
  // References and hooks
  const username = Cookies.get("username");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const reduxChat = useSelector(state => state.chats);
  
  // Track current peer ID (recipient)
  const [peerId, setPeerId] = useState("");

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [reduxChat]);

  // Set default user when users list is loaded
  useEffect(() => {
    if (!searchParams.get("user") && users?.length > 0) {
      setSearchParams({ user: users[0]?.username });
    }
  }, [users, searchParams]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!users?.length || !name) {
        await fetchMe();
        await fetchUser();
      }
    };
    
    loadInitialData();
  }, []);

  // Update peer ID when search params change
  useEffect(() => {
    const currentPeerId = searchParams.get("user");
    if (currentPeerId && currentPeerId !== peerId) {
      setPeerId(currentPeerId);
    }
  }, [searchParams]);

  // Load recipient data and messages when peer ID changes
  useEffect(() => {
    if (peerId) {
      fetchRecipient();
      fetchMessages();
    }
  }, [peerId]);

  // Fetch current user's metadata
  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user/metadata?username=${username}`);
      setName(data?.data?.name);
      setAvatar(data?.data?.avatar_url);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch recipient's metadata
  const fetchRecipient = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user/metadata?username=${peerId}`);
      setRecipientName(data?.data?.name);
      setRecipientAvatar(data?.data?.avatar_url);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch all users
  const fetchUser = async () => {
    try {
      setIsUsersLoading(true);
      const { data } = await axios.get(`${API_URL}/user?username=${username}`);
      setUsers(data?.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  // Fetch messages for current conversation
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/message?from=${username}&to=${peerId}`);
      
      // Clear existing messages
      dispatch(clearMessages());
      
      // Update with fetched messages
      if (data?.data?.length) {
        setChats(data.data);
        dispatch(initialMessages(data.data));
      } else {
        setChats([]);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle user selection
  const onSelectUser = (userId) => {
    setSearchParams({ user: userId });
    setPeerId(userId);
  };

  // Handle logout
  const onLogout = () => {
    handleLogout();
    navigate("/");
  };

  // Format timestamp for display
  const formatTimestamp = (ms) => {
    if (!ms) return "";
    
    const date = new Date(ms);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return time;
    if (isYesterday) return `Yesterday at ${time}`;
    
    return date.toLocaleDateString() + ' at ' + time;
  };

  // Handle API errors
  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.error(error);
  };

  // Handle message sending on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message, peerId, chats, setChats, setMessage);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-screen">
        {/* User Info */}
        <div className="mb-4 flex gap-2 items-center">
          <img
            src={avatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"}
            alt={name || "User"}  
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-xl font-bold capitalize">{name || "User"}</p>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
          {isUsersLoading ? (
            <div className="text-center p-4">Loading users...</div>
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.username}
                onClick={() => onSelectUser(user.username)}
                className={`p-2 rounded cursor-pointer capitalize flex items-center gap-2 hover:bg-gray-700 transition ${
                  user.username === searchParams.get("user") ? 'bg-gray-700' : ''
                }`}
              >
                {/* <div className="w-2 h-2 rounded-full bg-green-500"></div> */}
                {user.name}
              </div>
            ))
          ) : (
            <div className="text-center p-4">No users available</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
          <div className="font-semibold text-lg capitalize flex items-center gap-2">
            {peerId ? (
              <>
                <img
                  src={recipientAvatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"}
                  alt={recipientName || "Recipient"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                {recipientName || peerId}
              </>
            ) : (
              <span>Select a user to chat</span>
            )}
          </div>
          <button 
            className="bg-slate-600 px-3 py-2 text-sm text-white rounded hover:bg-slate-700 transition"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {reduxChat.length > 0 ? (
            reduxChat.map((msg) => (
              <div 
                key={msg?.id || msg?.timestamp} 
                className={`flex ${msg?.to !== username ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end space-x-2 max-w-md">
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      msg?.to !== username
                        ? "bg-blue-500 text-white"
                        : "bg-[#606c7e] text-white"
                    }`}
                  >
                    <div>{msg?.msg}</div>
                    <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
                      <span>{formatTimestamp(msg?.time || msg?.timestamp)}</span>
                      {msg?.to !== username && msg?.status && (
                        <span className="ml-2 capitalize">
                          {msg?.status === "sent" && "✓"}
                          {msg?.status === "delivered" && "✓✓"}
                          {msg?.status === "read" && "✓✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {peerId ? "No messages yet. Start a conversation!" : "Select a user to start chatting"}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {peerId && (
          <div className="p-4 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500 transition"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!peerId}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => handleSendMessage(message, peerId, chats, setChats, setMessage)}
              disabled={!peerId || !message.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;