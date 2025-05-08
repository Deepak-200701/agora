import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  unReadMessages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addUnreadMessage: (state, action) =>{
      state.unReadMessages.push(action.payload)
    },
    updateMessageStatus: (state, action) => {
      const { id, status } = action.payload;
      const message = state.messages.find(msg => msg.id === id);
      if (message) {
        message.status = status;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearUnReadMessages: (state) => {
      state.unReadMessages = [];
    },
  },
});

export const { addMessage,addUnreadMessage, updateMessageStatus, clearMessages, clearUnReadMessages } = chatSlice.actions;
export default chatSlice.reducer;