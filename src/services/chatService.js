import AgoraChat from "agora-chat";

// Replace with your app key
const APP_KEY = "611338321#1542472";

export function initializeChatClient({ 
  onConnected, 
  onDisconnected, 
  onTextMessage, 
  onTokenWillExpire,
  onTokenExpired,
  onError,
  onMessageDelivered,
  onMessageRead,
  onReceipt
}) {
  const chatClient = new AgoraChat.connection({
    appKey: APP_KEY,
    delivery: true, // Enable delivery receipts
    read: true      // Enable read receipts
  });

  chatClient.addEventHandler("connection&message", {
    onConnected: () => {
      const user = chatClient.context.userId;
      onConnected && onConnected(user);
    },
    onDisconnected: () => {
      onDisconnected && onDisconnected();
    },
    onTextMessage: (message) => {
      // Automatically send delivery receipt when receiving a message
      if (message.id) {
        chatClient.sendDeliveryAck(message);
      }
      onTextMessage && onTextMessage(message);
    },
    onTokenWillExpire: () => {
      onTokenWillExpire && onTokenWillExpire();
    },
    onTokenExpired: () => {
      onTokenExpired && onTokenExpired();
    },
    onError: (error) => {
      onError && onError(error);
    },
    // Handle delivery receipts
    onDeliveryAck: (message) => {
      onMessageDelivered && onMessageDelivered(message);
    },
    // Handle read receipts
    onReadAck: (message) => {
      onMessageRead && onMessageRead(message);
    },
    // General receipt handler
    onReceipt: (receipt) => {
      onReceipt && onReceipt(receipt);
    }
  });

  return chatClient;
}

export function createTextMessage(recipientId, messageText) {
  const options = {
    chatType: "singleChat",
    type: "txt",
    to: recipientId,
    msg: messageText,
    deliverOnlineOnly: false, // Send delivery receipt even if user is offline
    ext: { timestamp: Date.now() } // Additional metadata for tracking
  };
  
  return AgoraChat.message.create(options);
}

// Send a read receipt for a message
export function sendReadReceipt(chatClient, message) {
  if (chatClient && message && message.id) {
    chatClient.sendReadAck(message);
    return true;
  }
  return false;
}