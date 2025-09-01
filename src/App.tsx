
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MeetingDetail from './pages/MeetingDetail';
import ActionPlans from './pages/ActionPlans';
import Archive from './pages/Archive';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { MeetingProvider } from './contexts/MeetingContext';

const App: React.FC = () => {
  return (
      <AuthProvider>
        <MeetingProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
              <Route path="/meeting/:id" element={<PrivateRoute><MainLayout><MeetingDetail /></MainLayout></PrivateRoute>} />
              <Route path="/action-plans" element={<PrivateRoute><MainLayout><ActionPlans /></MainLayout></PrivateRoute>} />
              <Route path="/archive" element={<PrivateRoute><MainLayout><Archive /></MainLayout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><MainLayout><Profile /></MainLayout></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><MainLayout><Settings /></MainLayout></PrivateRoute>} />
            </Routes>
          </HashRouter>
        </MeetingProvider>
      </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext not found');
  }
  return authContext.user ? children : <Navigate to="/login" />;
};


export default App;