// import React, { useCallback, useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import ChatWindow from '../components/ChatWindow';
// import AgoraChat from "agora-chat";
// import { useDispatch } from 'react-redux';
// import { addMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';
// import { useNavigate } from 'react-router-dom';
// import { Bounce, toast } from 'react-toastify';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// // import { chatClient } from '../Config/agora.config';

// const Profile = ({ handleSendMessage, chatClient, handleLogout }) => {

//     console.log(chatClient.current, "current");


//     const [chats, setChats] = useState([]);

//     const dispatch = useDispatch();
//     const naigate = useNavigate()

//     useEffect(() => {
//         const token = Cookies.get("auth_token");
//         const username = Cookies.get("username");

//         if (!token || !username) naigate("/")
//     }, [])

//     useEffect(() => {
//         // if (!chatClient.current) return
//         // chatClient.current = new AgoraChat.connection({
//         //     appKey: import.meta.env.VITE_AGORA_APP_KEY,
//         // });

//         // Adds the event handler.
//         chatClient.current?.addEventHandler("connection&message", {
//             // Occurs when the app is connected to Agora Chat.
//             onConnected: () => {
//                 // setIsLoggedIn(true);
//                 // toast.success(`User Connect success !`, {
//                 //     position: "bottom-right",
//                 //     autoClose: 1000,
//                 //     hideProgressBar: false,
//                 //     closeOnClick: false,
//                 //     pauseOnHover: true,
//                 //     draggable: true,
//                 //     progress: undefined,
//                 //     theme: "light",
//                 //     transition: Bounce,
//                 // });
//             },
//             // // Occurs when the app is disconnected from Agora Chat.
//             onDisconnected: () => {
//                 // setIsLoggedIn(false);
//                 // toast.info(`User Logout success !`, {
//                 //     position: "bottom-right",
//                 //     autoClose: 1000,
//                 //     hideProgressBar: false,
//                 //     closeOnClick: false,
//                 //     pauseOnHover: true,
//                 //     draggable: true,
//                 //     progress: undefined,
//                 //     theme: "light",
//                 //     transition: Bounce,
//                 // });
//             },
//             // // Occurs when a text message is received.
//             onTextMessage: (message) => {
//                 console.log(message, "from Recieved");
//                 console.log(chatClient.chatClient, "current");
                

//                 const options = {
//                     chatType: "singleChat", // The chat type: singleChat for one-to-one chat.
//                     type: "channel", // The type of read receipt: channel indicates the conversation read receipt.
//                     to: message.to, // The user ID of the message receipt.
//                 };
//                 const msg = AgoraChat.message.create(options);
//                 chatClient.current?.send(msg);


//                 // chatClient.current.ackMessage({
//                 //     mid: message.id,
//                 //     to: message.from,
//                 // });

//                 setChats([...chats, { ...message, status: "recieved" }])
//                 dispatch(addMessage({ ...message, status: "recieved" }))
//                 // dispatch(updateMessageStatus({ id: message.id, status: "recieved" }))

//                 // addLog(`${message.msg}`);
//             },

//             onReceivedMessage: function (message) { },

//             onDeliveredMessage: (msg) => {
//                 console.log('from Delivered:', msg.id);
//                 // onUpdateMessageStatus(msg.id, "delivered")
//                 // dispatch(updateMessageStatus({ id: msg.id, status: "delivered" }))
//             },


//             onChannelMessage: (msg) => {
//                 console.log('Read:', msg.id);
//                 // onUpdateMessageStatus(msg.id, 'read');
//                 // dispatch(updateMessageStatus({ id: msg.id, status: "read" }))
//             }
//             // onReadMessage: (msg) => {
//             //     console.log('Read:', msg.id);
//             //     // onUpdateMessageStatus(msg.id, 'read');
//             //     // dispatch(updateMessageStatus({ id: msg.id, status: "read" }))
//             // }
//             // // Occurs when the token is about to expire.
//             // onTokenWillExpire: () => {
//             //     addLog("Token is about to expire");
//             // },
//             // // Occurs when the token has expired.
//             // onTokenExpired: () => {
//             //     addLog("Token has expired");
//             // },
//             // onError: (error) => {
//             //     addLog(`on error: ${error.message}`);
//             // },
//         });
//     }, []);

//     const onUpdateMessageStatus = useCallback((id, newStatus) => {
//         setChats(prev => {
//             const index = prev.findIndex(msg => msg.id === id);
//             if (index === -1) return prev; // No update needed

//             const updated = [...prev];
//             updated[index] = { ...updated[index], status: newStatus };
//             return updated;
//         });
//     }, []);

//     return (

//         <ChatWindow handleLogout={handleLogout} handleSendMessage={handleSendMessage} chats={chats} setChats={setChats} />
//     )
// }

// export default Profile;


import React, { useCallback, useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import AgoraChat from "agora-chat";
import { useDispatch } from 'react-redux';
import { addMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import Cookies from 'js-cookie';

const Profile = ({ handleSendMessage, chatClient, handleLogout }) => {
    const [chats, setChats] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Set up Agora Chat event handlers
    useEffect(() => {
        if (!chatClient?.current) {
            // Redirect to login if no chat client
            navigate("/");
            return;
        }

        // Create a unique handler identifier to avoid duplicate handlers
        const handlerId = `connection&message_${Date.now()}`;

        const eventHandler = {
            // Connection events
            onConnected: () => {
                console.log("Connected to Agora Chat");
            },
            onDisconnected: () => {
                console.log("Disconnected from Agora Chat");
                navigate("/");
            },
            
            // Message events
            onTextMessage: (message) => {
                console.log("Received message:", message);

                // Send read receipt
                try {
                    const options = {
                        id: message.id,
                        chatType: "singleChat",
                        type: "channel", 
                        to: message.to,
                    };
                    const msg = AgoraChat.message.create(options);
                    chatClient.current?.send(msg);
                } catch (error) {
                    console.error("Error sending read receipt:", error);
                }

                // Update local state with received message
                const newMessage = { ...message, status: "received" };
                setChats(prev => [...prev, newMessage]);
                dispatch(addMessage(newMessage));
            },

            // Delivery & read receipts
            onReceivedMessage: function (message) {
                console.log('Message received confirmation:', message);
            },

            onDeliveredMessage: (message) => {
                console.log('Message delivered:', message.id);
                // updateMessageStatusHandler(message.id, "delivered");
            },

            onReadMessage: (message) => {
                console.log('Message read:', message.id);
                // updateMessageStatusHandler(message.id, "read");
            },

            onChannelMessage: (message) => {
                // console.log('Channel message (read receipt):', message.id);
                // updateMessageStatusHandler(message.id, "read");
            },
            
            // Error handling
            // onError: (error) => {
            //     console.error("Agora chat error:", error);
            //     toast.error(`Chat error: ${error.message}`, {
            //         position: "bottom-right",
            //         autoClose: 3000,
            //     });
            // }
        };

        // Add event handler
        chatClient.current.addEventHandler(handlerId, eventHandler);

        // Cleanup function to remove event handler when component unmounts
        return () => {
            if (chatClient.current) {
                chatClient.current.removeEventHandler(handlerId);
            }
        };
    }, [dispatch, navigate]);

    // Function to update message status in local state and Redux
    const updateMessageStatusHandler = useCallback((id, newStatus) => {
        // alert(`check, ${id},${ newStatus}`)
        setChats(prev => {
            const index = prev.findIndex(msg => msg.id === id);
            if (index === -1) return prev;

            const updated = [...prev];
            updated[index] = { ...updated[index], status: newStatus };
            return updated;
        });
        
        dispatch(updateMessageStatus({ id, status: newStatus }));
    }, [dispatch]);

    return (
        <ChatWindow 
            handleLogout={handleLogout} 
            handleSendMessage={handleSendMessage} 
            chats={chats} 
            setChats={setChats} 
        />
    );
};

export default Profile;