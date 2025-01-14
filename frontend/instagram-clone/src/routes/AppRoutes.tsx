import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProfilePage from '../pages/Profile/ProfilePage';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoutes from './ProtectedRoutes';
import MainLayout from '../layouts/MainLayout';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import ChatWindow from '../pages/Chat/ChatWindow';
import Explore from '../pages/Explore/Explore';
import Setting from '../pages/Setting/Setting';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected routes */}

      <Route path="/" element={ <ProtectedRoutes><MainLayout /></ProtectedRoutes>} >
      <Route index element={ <ProtectedRoutes><Navigate to="home" replace /></ProtectedRoutes>} />
        <Route path="home" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<ChatWindow />} />
        <Route path="search" element={<Explore />} />
        <Route path="settings" element={<Setting/>} />
      </Route>
      

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;