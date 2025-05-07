import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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
  },
});

export const { addMessage, updateMessageStatus, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;