import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AgoraChat from "agora-chat";
import { Bounce, toast } from "react-toastify";

const navigate = useNavigate();

export const chatClient = useRef(null);

export const handleAgoraLogin = async (userId, token) => {
    if (userId && token) {
        chatClient.current.open({
            user: userId,
            // Use agoraToken for v1.2.1 and earlier, but accessToken for 1.2.2 and later.
            accessToken: token,
        });
        return true
    } else {
        return false
    }
};

export const handleLogout = () => {
    chatClient.current.close();
    navigate("/");
};


export const handleSendMessage = async (message, peerId, setChat) => {

    try {
        if (!message.trim()) {
            return toast.success("Please enter message content", {
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
        };

        let msg = AgoraChat.message.create(options);

        const payload = {
            sender_id: userId,
            recipient_id: msg.to,
            content: msg.msg,
            timestamp: msg.time,
            message_type: msg.type
        }

        await chatClient.current.send(msg);
        // await axios.post("http://localhost:3000/api/message", payload);

        // addLog(`${message}`);

        setChat(message);

        return {
            success: true,
            message: message
        };

    } catch (error) {
        toast.success(`Message send failed: ${error.message}`, {
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