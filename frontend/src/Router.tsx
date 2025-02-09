import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './pages/Main.Layout';
import  AuthPage  from './pages/Auth/AuthPage';
import Profile from './pages/Profile/ProfilePage';
import MessagePage from './pages/Message/MessagePage';
import SettingPage from './pages/Setting/SettingPage';
import NotificationPage from './pages/Notification/NotificationPage';
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="messages" element={<MessagePage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="explore" element={<ExplorePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

