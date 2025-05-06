import React, { useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { addMessage, clearMessages, initialMessages } from '../redux/reducers/chat.reducer';
import { Bounce, toast } from 'react-toastify';

function ChatWindow({ chats = [], handleSendMessage, setChats, handleLogout }) {
  const API_URL = import.meta.env.VITE_API_URL

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUsersLoading, setIsIsersLoading] = useState(false)
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAvatar, setRecipientAvatar] = useState("");
  const username = Cookies.get("username");
  // console.log(users, "check");


  const [searchParams, setSeachParams] = useSearchParams();
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState("");
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!searchParams.get("user") && users && users?.length){      
      searchParams.append("user",users[0]?.username)
      setSeachParams(searchParams);
    }
  },[users])

  useEffect(() => {
    if (!users?.length || !name) {
      fetchMe();
      fetchUser()
    }
  }, []);

  useEffect(() => {
    if (peerId) {
      fetchRecipient()
      fetchMessages()
    }
  }, [peerId])

  useEffect(() => {
    const peerId = searchParams.get("user");
    setPeerId(peerId);
  }, [searchParams]);

  const onLogout = ()=>{
    handleLogout()
    navigate("/")
  }

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/metadata?username=${username}`);

      setName(data?.data?.name)
      setAvatar(data?.data?.avatar_url)
    } catch (error) {
      toast.error(error.message, {
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
  }

  const fetchRecipient = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/metadata?username=${peerId}`);

      // setRecipientName(data?.data?.data?.nickname)
      // setRecipientAvatar(data?.data?.data?.avatarurl)

      setRecipientName(data?.data?.name)
      setRecipientAvatar(data?.data?.avatar_url)
    } catch (error) {
      toast.error(error.message, {
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
  }

  const fetchUser = async () => {
    try {
      setIsIsersLoading(true);
      const { data } = await axios.get(`${API_URL}/user?username=${username}`);
      setUsers([...data?.data]);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsIsersLoading(false);
    }
  }

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/message?from=${username}&to=${peerId}`);

      console.log([...chats, ...data.data], "my msg");
      dispatch(clearMessages())

      if (data?.data?.length) {
        setChats((prev) => [...data?.data]);
        dispatch(initialMessages(data.data))
      }


      // setRecipientName(data?.data?.name)
      // setRecipientAvatar(data?.data?.avatar_url)
    } catch (error) {
      toast.error(error.message, {
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
  }

  const onSelectUser = (userId) => {
    const isAvailable = searchParams.get("user")

    if (isAvailable) {
      searchParams.delete("user");
      searchParams.append("user", userId);
      setSeachParams(searchParams);
    }
    else {
      searchParams.append("user", userId);
      setSeachParams(searchParams);
    }
    setSelectedUser(userId)
  }

  const reduxChat = useSelector(state => state.chats);
  const user = Cookies.get("username");

  console.log(reduxChat, "redux");


  console.log(reduxChat, "chating");

  const formatTimestamp = (ms) => {
    const date = new Date(ms);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `${time}`;
    if (isYesterday) return `Yesterday at ${time}`;

    return date.toLocaleDateString() + ' at ' + time;
  }

  return (
    // <div className="flex flex-col flex-1 w-full m-[-1px]">
    //   <div className='w-full bg-blue-600 h-10'></div>
    //   {/* <div className="flex-1 p-4 overflow-y-auto space-y-2">
    //     {
    //       reduxChat && reduxChat.length > 0 && reduxChat.map((chat, index) => {
    //         return (
    //           <MessageBubble key={index} text={chat} sender={index % 2 === 0 ? "other" : "me"} />
    //         )
    //       })
    //     }
    //   </div> */}

    //   <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-gray-50">
    //     {reduxChat.map((msg) => (
    //       <div key={msg?.id} className={`flex ${msg?.to !== user ? "justify-end" : "justify-start"}`}>
    //         <div className="flex items-end space-x-2 max-w-md">
    //           {msg?.from !== "You" && (
    //             <img
    //               src={msg?.avatar}
    //               alt={msg?.from}
    //               className="w-8 h-8 rounded-full"
    //             />
    //           )}
    //           <div
    //             className={`p-3 rounded-lg text-sm ${msg?.to !== user
    //               ? "bg-blue-500 text-white"
    //               : "bg-gray-200 text-gray-900"
    //               }`}
    //           >
    //             <div className="font-semibold mb-1">{msg?.from}</div>
    //             <div>{msg?.msg}</div>
    //             <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
    //               <span>{formatTimestamp(msg?.time)}</span>
    //               {msg?.to !== user && (
    //                 <span className="ml-2 capitalize">✓ {msg?.status}</span>
    //               )}
    //             </div>
    //           </div>
    //           {msg?.to !== user && (
    //             <img
    //               src={msg?.avatar}
    //               alt={msg?.from}
    //               className="w-8 h-8 rounded-full"
    //             />
    //           )}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //   <MessageInput
    //     handleSendMessage={handleSendMessage}
    //     message={message}
    //     setMessage={setMessage}
    //     chats={chats}
    //     setChats={setChats}
    //   />
    // </div>

    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 space-y-2">
        <div className='mb-8 flex gap-2 justify-start items-center mt-2'>
          <img
            src={avatar || null}
            alt={name}
            className="w-10 h-10 rounded-full"
          />
          <p className="text-xl font-bold capitalize p-0 m-0">{name}</p>
        </div>
        <div className="space-y-2">
          {users && users?.length ?
            users.map((user) => (
              <div
                key={user.username}
                onClick={() => onSelectUser(user.username)}
                className={`
                  p-2 rounded cursor-pointer capitalize
                  ${user.username === searchParams.get("user") ? ' bg-gray-700' : ""}
                `}
              >
                {user.name}
              </div>
            )) : <></>
          }
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
          <div className="font-semibold text-lg capitalize flex items-center gap-2">
            <img
              src={recipientAvatar || null}
              alt={recipientName}
              className="w-8 h-8 rounded-full"
            />
            {recipientName}
          </div>
          <button className="bg-slate-600 px-3 py-2 text-sm text-white" onClick={onLogout}>Logout</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-gray-50">
          {reduxChat.length ? reduxChat.map((msg) => (
            <div key={msg?.id} className={`flex ${msg?.to !== user ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end space-x-2 max-w-md">
                {/* {msg?.to !== user && (
                    <img
                      src={msg?.avatar}
                      alt={msg?.from}
                      className="w-8 h-8 rounded-full"
                    />
                  )} */}
                <div
                  className={`p-3 rounded-lg text-sm ${msg?.to !== user
                    ? "bg-blue-500 text-white"
                    : "bg-[#606c7e] text-white"
                    }`}
                >
                  {/* <div className="font-semibold mb-1">{msg?.from}</div> */}
                  <div>{msg?.msg}</div>
                  <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
                    <span>{formatTimestamp(msg?.time || msg?.timestamp)}</span>
                    {msg?.to !== user && (
                      <span className="ml-2 capitalize">{msg?.status}</span>
                    )}
                  </div>
                </div>
                {/* {msg?.to !== user && (
                    <img
                      src={msg?.avatar}
                      alt={msg?.from}
                      className="w-8 h-8 rounded-full"
                    />
                  )} */}
              </div>
            </div>
          )) : <></>}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(message, peerId, chats, setChats, setMessage)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleSendMessage(message, peerId, chats, setChats, setMessage)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
