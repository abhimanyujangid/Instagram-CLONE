import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { LoginCredentials } from "../../types/AuthTypes";
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { inputLoginData } from "../../constants/constant";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginCredentials>({ 
    email: "", 
    password: "", 
    username: "" 
  });

  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
 


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return ;
  }, [error]);



  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submit handler
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
      navigate('home');
      toast.success('Login successful');

    } catch (err) {
      toast.error('Login failed');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-300">
    <Card className="w-[400px] mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Socialize</CardTitle>
        <CardDescription className="text-center">Connect with friends and share moments</CardDescription>
      </CardHeader>
      
      {/* Form section start */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
         {inputLoginData && inputLoginData.map((input,index) => (
         <div className="space-y-2" key={index}>
            <Input
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={form[input.name as keyof typeof form]}
              onChange={handleChange}
              disabled={loading}
            />
          </div>)) }

          
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
  </div>
  );
};

export default Login;