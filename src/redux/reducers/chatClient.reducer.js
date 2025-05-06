import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const chatClientSlice = createSlice({
  name: 'chatClient',
  initialState,
  reducers: {
    initializeClient: (state, action) => {
      return action.payload
    },
  },
})

export const { initializeClient } = chatClientSlice.actions

export default chatClientSlice.reducer