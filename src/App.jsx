import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatWindow from './components/ChatWindow';
import NotFound from './pages/NotFound';
import { useAgoraChat } from './hooks/useAgoraChat';

const App = () => {
  const { isConnected, isConnecting, initializeFromStorage } = useAgoraChat();
  const [isInitialized, setIsInitialized] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated) || isConnected;

  // Initialize app on load
  useEffect(() => {
    const init = async () => {
      await initializeFromStorage();
      setIsInitialized(true);
    };
    init();
  }, [initializeFromStorage]);

  // Show loading screen while initializing
  if (!isInitialized || isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <Register />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatWindow /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
