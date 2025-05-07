import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import chatReducer from './reducers/chat.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});