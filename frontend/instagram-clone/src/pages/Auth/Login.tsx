import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { LoginCredentials } from "../../types/AuthTypes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import { useNavigate } from "react-router-dom";
import { inputLoginData } from "../../constants/constant";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginCredentials>({
    email: "",
    password: "",
    username: "",
  });

  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        theme: currentTheme === "dark" ? "dark" : "light",
      });
    }
    return;
  }, [error, currentTheme]);

  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required", {
        position: "top-right",
        theme: currentTheme === "dark" ? "dark" : "light",
      });
      return;
    }

    try {
      await dispatch(
        login({
          email: form.email,
          password: form.password,
          username: form.username,
        })
      ).unwrap();
      toast.success("Login successful", {
        position: "top-right",
        theme: currentTheme === "dark" ? "dark" : "light",
      });
      navigate("home");
    } catch (err) {
      toast.error("Login failed", {
        position: "top-right",
        theme: currentTheme === "dark" ? "dark" : "light",
      });
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen w-screen ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
          : "bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 text-black"
      }`}
    >

      {/* Login Card */}
      <Card
        className={` ${
          currentTheme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Socialize
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Connect with friends and share moments
          </CardDescription>
        </CardHeader>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            {inputLoginData &&
              inputLoginData.map((input, index) => (
                <div className="space-y-2" key={index}>
                  <Input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={form[input.name as keyof typeof form]}
                    onChange={handleChange}
                    disabled={loading}
                    className={`py-3 px-4 rounded-md ${
                      currentTheme === "dark"
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-gray-200 text-black placeholder-gray-500"
                    }`}
                  />
                </div>
              ))}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold text-lg rounded-md transition-transform transform hover:scale-105 ${
                currentTheme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between px-8">
            <span>Don’t have an account?</span>
            <a
              href="/auth/register"
              className={`font-semibold underline ${
                currentTheme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Register
            </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
