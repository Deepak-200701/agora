import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './reducers/chat.reducer'
import chatClentReducer from "./reducers/chatClient.reducer"
import authReducer from "./reducers/auth.reducer"

export const store = configureStore({
    reducer: {
        chats: chatReducer,
        auth: authReducer,
        chatClient: chatClentReducer
    }
})