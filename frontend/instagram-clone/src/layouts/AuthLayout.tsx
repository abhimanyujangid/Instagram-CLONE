import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="auth-layout flex items-center justify-center h-screen bg-slate-500">
    <Outlet />
  </div>
);

export default AuthLayout;
