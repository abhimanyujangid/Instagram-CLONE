import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { LoginCredentials } from "../../types/AuthTypes";
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginCredentials>({ 
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
    return ;
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
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
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {/* <div className="text-red-500 text-sm">{error}</div> */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </CardContent>
        <CardFooter>
                    Create an account? <a href="/auth/register" className="text-blue-500 ml-2"> Register</a> 
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;