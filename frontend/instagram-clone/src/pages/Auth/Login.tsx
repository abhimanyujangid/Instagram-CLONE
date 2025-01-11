import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAuth";
import { LoginCredentials } from "../../types/AuthTypes";
import { ToastContainer, toast } from 'react-toastify';

interface LoginForm extends LoginCredentials {
  username?: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ 
    email: "", 
    password: "", 
    username: "" 
  });

  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

console.log(isAuthenticated)

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful');
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      await dispatch(login({ 
        email: form.email, 
        password: form.password,
        username: form.username
      })).unwrap();
      toast.success('Login successful');
    } catch (err) {
      toast.error('Login failed');
      console.error('Login failed:', err);
    }
  };

  return (
    <Card className="w-[400px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              name="username"
              placeholder="Username (optional)"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;