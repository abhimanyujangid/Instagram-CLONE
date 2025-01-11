import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import {isConfirmPasswordMatch, isValidEmail, isValidPassword} from "../../utils/validateInput";
import { useDispatch } from "react-redux";
import { register } from "../../features/auth/authSlice";

const Register: React.FC = () => {

  const [form, setForm] = useState({ email: "", password: "", username: "", fullName: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, username, fullName, confirmPassword } = form;
    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long ");
      return;
    }
    if (!isConfirmPasswordMatch(password, confirmPassword)) {
      setError("Passwords do not match");
      return;
    }
    // Call backend API here
   dispatch(register({ email: form.email, password: form.password , username: form.username, fullName: form.fullName}) as any);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-300">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
          <Input
              type="text"
              placeholder="Full Name"
              value={form?.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Username"
              value={form?.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full"
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={form?.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={form?.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full"
            />
            <div className="text-red-500 text-sm">{error}</div>
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

