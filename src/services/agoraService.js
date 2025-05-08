import AgoraChat from 'agora-chat';
import Cookies from 'js-cookie';
import { Bounce, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

class AgoraService {
  constructor() {
    this.client = null;
    this.eventHandlers = new Map();
    this.isInitialized = false;
    this.recieverId = ""
    this.conversations = [];
  }

  initialize() {
    if (this.isInitialized) return this.client;

    this.client = new AgoraChat.connection({
      appKey: import.meta.env.VITE_AGORA_APP_KEY,
      delivery: true,
      read: true
    });

    this.isInitialized = true;
    return this.client;
  }

  async connect(userId, token) {
    if (!this.isInitialized) {
      this.initialize();
    }

    try {
      await this.client.open({
        user: userId,
        accessToken: token,
      });
      return true;
    } catch (error) {
      console.error("Failed to connect to Agora:", error);
      throw error;
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.close();
      } catch (error) {
        console.error("Error disconnecting from Agora:", error);
      }
    }
  }

  addEventHandler(handlerId, handlers) {
    if (!this.client) {
      throw new Error("Chat client not initialized");
    }

    // Remove existing handler with same ID if it exists
    if (this.eventHandlers.has(handlerId)) {
      this.removeEventHandler(handlerId);
    }

    this.client.addEventHandler(handlerId, handlers);
    this.eventHandlers.set(handlerId, handlers);
    return handlerId;
  }

  removeEventHandler(handlerId) {
    if (this.client && this.eventHandlers.has(handlerId)) {
      this.client.removeEventHandler(handlerId);
      this.eventHandlers.delete(handlerId);
    }
  }

  async sendMessage(senderId, receiverId, text) {
    if (!this.client) {
      throw new Error("Chat client not initialized");
    }

    if (!text || !text.trim()) {
      throw new Error("Message cannot be empty");
    }

    const uniqueId = uuidv4();

    const options = {
      chatType: "singleChat",
      type: "txt",
      from: senderId,
      to: receiverId,
      msg: text,
      ext: {
        trackingId: uniqueId
      },
      // Explicitly request delivery acknowledgment
      deliverOnlineOnly: false,
      requireDeliveryAck: true,
      requireReadAck: true
    };

    const msg = AgoraChat.message.create(options);
    const serverMsg = await this.client.send(msg);

    return {
      ...serverMsg.message,
      status: "sent" // Initial status
    };
  }

  // Send read receipt for a message
  // async sendReadReceipt(message) {
  //   console.log("from reciept", message);

  //   if (!this.client) return;

  //   try {
  //     const options = {
  //       id: message.id,
  //       chatType: "singleChat",
  //       type: "channel", 
  //       to: message.from,
  //       ext: {
  //         trackingId: message.ext.trackingId
  //       }
  //   };
  //   const msg = AgoraChat.message.create(options);

  //   this.client?.send(msg);
  //   } catch (error) {
  //     console.error("Error sending read receipt:", error);
  //   }
  // }

  setReciever(id) {
    this.recieverId = id
  }

  getReciever() {
    return this.recieverId
  }

  async sendReadReceipt(message) {
    if (message.from !== this.recieverId) return

    if (!this.client) return;

    try {
      // For message-level read receipt
      const options = {
        type: "read",           // The message read receipt type
        chatType: "singleChat", // For one-to-one chat
        to: message.from,       // The user ID of the message sender
        id: message.id,         // The ID of the message being acknowledged as read
      };

      // Create the read receipt message
      const msg = AgoraChat.message.create(options);

      // Send the read receipt
      await this.client.send(msg);
    } catch (error) {
      console.error("Error sending read receipt:", error);
    }
  }

  async getConversationsList() {
    const conversations = await this.client.getConversationlist()
    this.conversations = conversations;
  }

  async getMessages(userId) {
    try {
      // const messages = await this.client.getServerConversations({ pageSize: 50, cursor: "" })
      // return messages;
      const messages = await this.client.getHistoryMessages({
        targetId: userId, // The user ID of the peer user for one-to-one chat or group ID for group chat.
        chatType: "singleChat", // The chat type: `singleChat` for one-to-one chat or `groupChat` for group chat.
        pageSize: 200, // The number of messages to retrieve per page. The value range is [1,50] and the default value is 20.
        searchDirection: "down", // The message search direction: `up` means to retrieve messages in the descending order of the message timestamp and `down` means to retrieve messages in the ascending order of the message timestamp.
        searchOptions: {
          // from: "message sender userID", // The user ID of the message sender. This parameter is used only for group chat.
          msgTypes: ["txt"], // An array of message types for query. If no value is passed in, all types of message will be queried.
          startTime: new Date("2025,5,8").getTime(), // The start timestamp for query. The unit is millisecond.
          endTime: new Date("2025,5,9").getTime(), // The end timestamp for query. The unit is millisecond.
        },
      });

      return messages

    }
    catch (error) {
      return toast.error(error.message, {
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


}

// Create a singleton instance
const agoraService = new AgoraService();
export default agoraService;