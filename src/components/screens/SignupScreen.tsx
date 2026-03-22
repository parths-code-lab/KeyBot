import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTheme } from "../ThemeProvider";
import { Moon, Sun, Bot, Eye, EyeOff, AlertCircle } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";

export function SignupScreen() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ SIMPLE VALIDATION (matches your doc style)
  const validate = () => {
    if (!email || !password) return "Fill in all fields";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSignup = async () => {
    const validationError = validate();
    setError(validationError);

    if (validationError) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("User already exists or invalid details");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C]">

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <GlassmorphCard className="w-full max-w-sm p-8 space-y-6" variant="elevated">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-white/20">
              <Bot size={32} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-medium text-white">KeyBot</h1>
            <p className="text-white/70 text-sm">
              AI Powered Keyword Search Bot
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`bg-white/10 text-white rounded-2xl h-12 ${
              error && !email ? "border border-red-400" : ""
            }`}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={`bg-white/10 text-white rounded-2xl h-12 pr-12 ${
                error && !password ? "border border-red-400" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSignup}
            className="w-full h-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white"
          >
            Sign Up
          </Button>

          <Button
            onClick={handleGoogleSignup}
            className="w-full h-12 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-white"
          >
            Sign up with Google
          </Button>
        </div>

        {/* Login Redirect */}
        <p className="text-white/70 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-300 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </GlassmorphCard>
    </div>
  );
}