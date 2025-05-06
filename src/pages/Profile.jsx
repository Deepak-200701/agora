import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import AgoraChat from "agora-chat";
import { useDispatch } from 'react-redux';
import { addMessage, updateMessageStatus } from '../redux/reducers/chat.reducer';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
// import { chatClient } from '../Config/agora.config';

const Profile = ({ handleSendMessage, chatClient, handleLogout }) => {

    console.log(chatClient.current, "current");
    

    const [chats, setChats] = useState([]);

    const dispatch = useDispatch();
    const naigate = useNavigate()

    useEffect(() => {
        const token = Cookies.get("auth_token");
        if (!token) naigate("/")
    }, [])

    useEffect(() => {
        if (!chatClient.current) return
        // chatClient.current = new AgoraChat.connection({
        //     appKey: import.meta.env.VITE_AGORA_APP_KEY,
        // });

        // Adds the event handler.
        chatClient.current?.addEventHandler("connection&message", {
            // Occurs when the app is connected to Agora Chat.
            onConnected: () => {
                // setIsLoggedIn(true);
                // toast.success(`User Connect success !`, {
                //     position: "bottom-right",
                //     autoClose: 1000,
                //     hideProgressBar: false,
                //     closeOnClick: false,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Bounce,
                // });
            },
            // // Occurs when the app is disconnected from Agora Chat.
            onDisconnected: () => {
                // setIsLoggedIn(false);
                // toast.info(`User Logout success !`, {
                //     position: "bottom-right",
                //     autoClose: 1000,
                //     hideProgressBar: false,
                //     closeOnClick: false,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Bounce,
                // });
            },
            // // Occurs when a text message is received.
            onTextMessage: (message) => {
                console.log(message, "from Recieved");

                // chatClient.current.ackMessage({
                //     mid: message.id,
                //     to: message.from,
                // });

                setChats([...chats, { ...message, status: "recieved" }])
                dispatch(addMessage({ ...message, status: "recieved" }))
                // dispatch(updateMessageStatus({ id: message.id, status: "recieved" }))

                // addLog(`${message.msg}`);
            },

            onDeliveredMessage: (msg) => {
                console.log('from Delivered:', msg.id);
                // onUpdateMessageStatus(msg.id, "delivered")
                // dispatch(updateMessageStatus({ id: msg.id, status: "delivered" }))
            },

            // onDeliveryAck: (msg)=>{
            //     console.log('from Delivered: S', msg.id);
            // },

            onReadMessage: (msg) => {
                console.log('Read:', msg.id);
                // onUpdateMessageStatus(msg.id, 'read');
                // dispatch(updateMessageStatus({ id: msg.id, status: "read" }))
            }
            // // Occurs when the token is about to expire.
            // onTokenWillExpire: () => {
            //     addLog("Token is about to expire");
            // },
            // // Occurs when the token has expired.
            // onTokenExpired: () => {
            //     addLog("Token has expired");
            // },
            // onError: (error) => {
            //     addLog(`on error: ${error.message}`);
            // },
        });
    }, []);

    const onUpdateMessageStatus = useCallback((id, newStatus) => {
        setChats(prev => {
            const index = prev.findIndex(msg => msg.id === id);
            if (index === -1) return prev; // No update needed

            const updated = [...prev];
            updated[index] = { ...updated[index], status: newStatus };
            return updated;
        });
    }, []);

    return (

        <ChatWindow handleLogout={handleLogout} handleSendMessage={handleSendMessage} chats={chats} setChats={setChats} />
    )
}

export default Profile;
