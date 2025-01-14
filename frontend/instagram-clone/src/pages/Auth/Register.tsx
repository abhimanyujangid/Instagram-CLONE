import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { isConfirmPasswordMatch, isValidEmail, isValidPassword } from "../../utils/validateInput";
import { register } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { inputDataRegister } from "../../constants/constant";
import { RegisterData } from "../../types/AuthTypes";
import {  toast } from 'react-toastify';
import { RootState } from "../../store";
const Register: React.FC = () => {

  const [form, setForm] = useState<RegisterData>({ email: "", password: "", username: "", fullName: "", confirmPassword: "" });
  const [formError, setFormError] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  console.log("isAuthenticated",isAuthenticated)

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

    useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);
  


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, username, fullName, confirmPassword } = form;
    if (!email || !password || !username || !fullName || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Invalid email");
      return;
    }
    if (!isValidPassword(password)) {
      setFormError("Password must be at least 8 characters long ");
      return;
    }
    if (!isConfirmPasswordMatch(password, confirmPassword)) {
      setFormError("Passwords do not match");
      return;
    }
    // Call backend API here
    try {
      await dispatch(register({
        email: form.email,
        password: form.password,
        username: form.username,
        fullName: form.fullName,
      } as RegisterData)).unwrap();
      setFormError("");
      toast.success('Register successful');
      setForm({
        email: "",
        password: "",
        username: "",
        fullName: "",
        confirmPassword: "",
      })
      
    } catch (error) {
      return;
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-300">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {inputDataRegister.map((input) => (
              <Input
                key={input.name}
                type={input.type}
                placeholder={input.placeholder}
                name={input.name}
                value={form[input.name as keyof typeof form]}
                onChange={handelOnChange}
                className="w-full"
              />
            ))}
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center">
          Already have an account? <a href="/auth/login" className="text-blue-500">Login</a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

