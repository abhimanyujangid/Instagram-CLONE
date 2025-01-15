import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "../../components/ui/card";
import { isConfirmPasswordMatch, isValidEmail, isValidPassword } from "../../utils/validateInput";
import { register } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { inputDataRegister } from "../../constants/constant";
import { RegisterData } from "../../types/AuthTypes";
import { toast } from "react-toastify";
import { RootState } from "../../store";

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterData>({ email: "", password: "", username: "", fullName: "", confirmPassword: "" });
  const [formError, setFormError] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        theme: currentTheme === "dark" ? "dark" : "light",
      });
    }
  }, [error, currentTheme]);

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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
      setFormError("Password must be at least 8 characters long");
      return;
    }
    if (!isConfirmPasswordMatch(password, confirmPassword)) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await dispatch(register({ email, password, username, fullName } as RegisterData)).unwrap();
      setFormError("");
      toast.success("Register successful", { theme: currentTheme === "dark" ? "dark" : "light" });
      setForm({ email: "", password: "", username: "", fullName: "", confirmPassword: "" });
    } catch (error) {
      return;
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen w-screen p-4 ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
          : "bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 text-black"
      }`}
    >
      <Card
        className={`w-full max-w-lg rounded-lg shadow-lg ${
          currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">Register</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Create an account to connect and share moments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6 px-6">
            {inputDataRegister.map((input) => (
              <div key={input.name} className="space-y-2">
                <Input
                  type={input.type}
                  placeholder={input.placeholder}
                  name={input.name}
                  value={form[input.name as keyof typeof form]}
                  onChange={handelOnChange}
                  className={`w-full rounded-md border ${
                    currentTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
            ))}
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <Button
              type="submit"
              className={`w-full rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm mt-4 flex justify-between px-9">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className={`font-semibold underline  ${
              currentTheme === "dark" ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
            }`}
          >
            Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
