import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProfilePage from '../pages/Profile/ProfilePage';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoutes from './ProtectedRoutes';

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
      <Route 
        path="/" 
        element={
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoutes>
            <ProfilePage />
          </ProtectedRoutes>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;