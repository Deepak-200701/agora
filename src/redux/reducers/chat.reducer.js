import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const ChatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    initialMessages: (state, action) => {      
      return [...action.payload];
    },

    addMessage: (state, action) => {
      state.push(action.payload)
    },
    updateMessageStatus: (state, action) => {
      const { id, status } = action.payload;
      const message = state.find(msg => msg.id === id);
      if (message) {
        message.status = status;
      }
    },
    removeMessage: (state, action) => {
      state = state.filter(msg => msg.id !== action.payload)
    },
    clearMessages: (state) => {
      return state = initialState
    },
  },
})

export const { addMessage, removeMessage, clearMessages, updateMessageStatus, initialMessages } = ChatSlice.actions

export default ChatSlice.reducer
