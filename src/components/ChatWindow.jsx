import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// import { addMessage } from '../redux/reducers/chat.reducer';
import { Bounce, toast } from 'react-toastify';
import { useAgoraChat } from '../hooks/useAgoraChat';
import agoraService from '../services/agoraService';
import AgoraChat from 'agora-chat';
import { addMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';

function ChatWindow() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { isConnected, chats, setChats,
        sendMessage, handleLogout, getUnReadMessages,
        removeUnreadMessage, sendImageMessage,
    } = useAgoraChat();

    const inputRef = useRef(null)

    // State management
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientAvatar, setRecipientAvatar] = useState("");
    const [currentChats, setCurrentChats] = useState([])
    const [imagePreview, setImagePreview] = useState(null);

    // References and hooks
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const reduxChat = useSelector(state => state.chat.messages);
    const unReadMessages = useSelector(state => state.chat.unReadMessages);

    // Track current peer ID (recipient)
    const [peerId, setPeerId] = useState("");

    const username = Cookies.get("username");
    const receiverId = searchParams.get("user")

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const isFileSizeValid = (file, maxSizeInMB) => {
        const sizeInMB = file.size / (1024 * 1024);
        return sizeInMB < maxSizeInMB;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const maxFileSize = 5 * 1024 * 1024;
        // const allowType = {
        //     jpg: true,
        //     jpeg: true,
        //     gif: true,
        //     png: true,
        //     bmp: true
        // }

        if (!file) return;

        // const parts = file.name.split('.');
        // const fileExtension = parts.length > 1 ? parts.pop().toLowerCase() : '';

        // if (!allowType[fileExtension]) {
        //     return toast.info(
        //         "Invalid file type. Please upload an image: jpg, jpeg, gif, png, bmp.",
        //         {
        //             position: "bottom-right",
        //             autoClose: 3000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //         }
        //     );
        // }

        if (!file.type.startsWith("image/")) {
            return toast.info(
                "Invalid file format. Only image file is accepted",
                {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }

        if (!isFileSizeValid(file, 5)) {
            return toast.info(
                "Maximum image size must be less than 5 MB",
                {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // const data = await sendImageMessage(receiverId, e.target, setImagePreview);
        // console.log(data, "image msg");
    }

    const removeImage = () => {
        setImagePreview(null);
        if (inputRef?.current) {
            inputRef.current.value = '';
        }
    }
    // useEffect(() => {
    //     if (chats && chats.length) {
    //         for (let i = 0; i < unReadMessages?.length; i++) {
    //             const msg = unReadMessages[i];
    //             alert(msg.id)
    //             updateMessageStatusHandler(msg.id, "read")
    //         }
    //     }
    // }, [unReadMessages, chats])

    useEffect(() => {
        // Filter messages by the current chat
        const currentChats = chats.filter(
            msg => (msg.from === username && msg.to === receiverId) ||
                (msg.to === username && msg.from === receiverId)
        );
        setCurrentChats(currentChats)
    }, [chats])


    // Effect to scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [reduxChat]);

    // Set default user when users list is loaded
    useEffect(() => {
        if (!searchParams.get("user") && users?.length > 0) {
            setSearchParams({ user: users[0]?.username });
        }

        sendUnReadMessageReciept(users[0]?.username)
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
            agoraService.setReciever(currentPeerId);
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
            //   dispatch(clearMessages());

            // Update with fetched messages
            if (data?.data?.length) {
                setChats(data.data);
                dispatch(addMessage(data.data));
            } else {
                setChats([]);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // const getUnreadMessages = async () => {
    //     const channelInfos = agoraService.conversations.data.channel_infos;
    //     const unreadIds = [];

    //     channelInfos.forEach(info => {
    //         if (info.unread_num > 0 && info.lastMessage && info.lastMessage.id) {
    //             unreadIds.push(info.lastMessage);
    //         }
    //     });

    //     return unreadIds;
    // }

    const sendReadReceipt = (from, msgId) => {
        // console.log("from reciept", message);
        try {
            const options = {
                id: msgId,
                chatType: "singleChat",
                type: "channel",
                to: from,
            };
            const msg = AgoraChat.message.create(options);

            agoraService.client?.send(msg);
        } catch (error) {
            console.error("Error sending read receipt:", error);
        }
    }

    const sendUnReadMessageReciept = (userId) => {
        const unreadMessage = getUnReadMessages();

        for (let i = 0; i < unreadMessage.length; i++) {
            if (unreadMessage[i].from === userId) {
                agoraService.sendReadReceipt(unreadMessage[i])
                removeUnreadMessage(unreadMessage[i])
            }
        }
    }


    // Handle user selection
    const onSelectUser = async (userId) => {
        setSearchParams({ user: userId });
        setPeerId(userId);
        agoraService.setReciever(userId)
        sendUnReadMessageReciept(userId)
        // sendReadReceipt(userId)
        // const options = {
        //     to: message.userId,
        //     id: "",
        // };

        // agoraService.sendReadReceipt(message)
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
            sendMessage(peerId, message, setMessage);
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
                                className={`p-2 rounded cursor-pointer capitalize flex items-center gap-2 hover:bg-gray-700 transition ${user.username === searchParams.get("user") ? 'bg-gray-700' : ''
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
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {currentChats?.length > 0 ? (
                        currentChats.map((msg) => (
                            <div
                                key={msg?.id || msg?.timestamp}
                                className={`flex ${msg?.to !== username ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex items-end space-x-2 max-w-md">
                                    <div
                                        className={`p-3 rounded-lg text-sm ${msg?.to !== username
                                            ? msg.type === "img" ? "" : "bg-blue-500 text-white"
                                            : msg.type === "img" ? "" : "bg-[#606c7e] text-white"
                                            }`}
                                    >
                                        {
                                            msg?.type === "img" ? (
                                                <div className={`${msg?.to !== username ? "bg-indigo-400" : "bg-gray-400"} w-[120px] rounded-lg p-1`}>
                                                    <img
                                                        src={msg?.thumb || msg?.thumb_url}
                                                        alt="Chat"
                                                        className="rounded-lg mb-1 bg-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div>{msg?.msg}</div>
                                            )
                                        }
                                        <div className="text-xs mt-1 flex justify-between items-center text-gray-300">
                                            <span>{formatTimestamp(msg?.time || msg?.timestamp)}</span>
                                            {msg?.to !== username && msg?.status && (
                                                <span className="ml-2 capitalize">
                                                    {msg?.status === "sent" && "sent"}
                                                    {msg?.status === "delivered" && "delivered"}
                                                    {msg?.status === "read" && "read"}
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
                    // <div className="p-4 border-t bg-white flex items-center gap-2">
                    //     <input
                    //         type="text"
                    //         placeholder="Type a message..."
                    //         className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500 transition"
                    //         value={message}
                    //         onChange={(e) => setMessage(e.target.value)}
                    //         onKeyDown={handleKeyDown}
                    //         disabled={!peerId}
                    //     />
                    //     <button
                    //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    //         onClick={() => sendMessage(peerId, message, setMessage)}
                    //         disabled={!peerId || !message.trim()}
                    //     >
                    //         Send
                    //     </button>
                    // </div>

                    // <div className="p-4 border-t bg-white flex flex-col items-center gap-2">
                    //     {/* Image Preview */}
                    //     {imagePreview && (
                    //         <div className="relative w-32 h-32">
                    //             <img
                    //                 src={imagePreview}
                    //                 alt="Preview"
                    //                 className="w-full h-full object-cover rounded-xl border border-gray-300"
                    //             />
                    //             <button
                    //                 className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
                    //                 onClick={removeImage}
                    //             >
                    //                 ✕
                    //             </button>
                    //         </div>
                    //     )}
                    //     {/* File Upload Button */}
                    //     <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center w-10 h-10">
                    //         <input
                    //             type="file"
                    //             className="hidden"
                    //             onChange={handleFileUpload} // You'll need to define this handler
                    //         />
                    //         <span className="text-xl font-bold text-gray-600">+</span>
                    //     </label>

                    //     {/* Message Input */}
                    //     <input
                    //         type="text"
                    //         placeholder="Type a message..."
                    //         className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500 transition"
                    //         value={message}
                    //         onChange={(e) => setMessage(e.target.value)}
                    //         onKeyDown={handleKeyDown}
                    //         disabled={!peerId}
                    //     />

                    //     {/* Send Button */}
                    //     <button
                    //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    //         onClick={() => sendMessage(peerId, message, setMessage)}
                    //         disabled={!peerId || !message.trim()}
                    //     >
                    //         Send
                    //     </button>
                    // </div>

                    <div className="p-4 border-t bg-white flex flex-col gap-2">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative w-16 h-16">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl border border-gray-300"
                                />
                                <button
                                    className="text-[12px] w-5 h-5 p-[1px] absolute top-0 right-0 bg-black opacity-[0.6] text-white rounded-full hover:opacity-80"
                                    onClick={removeImage}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Input Row */}
                        <div className="flex items-center gap-2">
                            {/* File Upload Button */}
                            <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded p-2 hover:bg-gray-200 transition flex items-center justify-center w-10 h-10">
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <span className="text-xl font-bold text-gray-600">+</span>
                            </label>

                            {/* Message Input */}
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500 transition"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                // onKeyDown={(e) => {
                                //     if (e.key === "Enter") {
                                //         sendMessage(peerId, message, setMessage, imagePreview);
                                //         setImagePreview(null);
                                //     }
                                // }}
                                disabled={!peerId || imagePreview}
                            />

                            {/* Send Button */}
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={() => {
                                    imagePreview ?
                                        sendImageMessage(receiverId, inputRef.current, setImagePreview) :
                                        sendMessage(peerId, message, setMessage, imagePreview)
                                }}
                                disabled={!peerId || (!message.trim() && !imagePreview)}
                            >
                                Send
                            </button>
                        </div>
                    </div>


                )}
            </div>
        </div>
    );
}

export default ChatWindow;