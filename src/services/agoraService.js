import AgoraChat from 'agora-chat';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

class AgoraService {
  constructor() {
    this.client = null;
    this.eventHandlers = new Map();
    this.isInitialized = false;
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

  async sendReadReceipt(message) {
    console.log("from receipt", message);
    
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
}

// Create a singleton instance
const agoraService = new AgoraService();
export default agoraService;