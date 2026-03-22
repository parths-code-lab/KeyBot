import React from "react";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useTheme } from "../ThemeProvider";
import {
  ArrowLeft,
  User,
  Moon,
  LogOut,
} from "lucide-react";

interface SettingsScreenProps {
  username?: string;
  email?: string | null;
  onLogout: () => void;
}

export function SettingsScreen({
  username = "User",
  email = "user@example.com",
  onLogout,
}: SettingsScreenProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C]">

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-white text-lg font-medium">Settings</h1>

        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 space-y-6">

        {/* Profile */}
        <GlassmorphCard className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4C63D2] to-[#6366F1] flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">{username}</h3>
              <p className="text-white/70 text-sm">{email}</p>
            </div>
          </div>
        </GlassmorphCard>

        {/* Preferences */}
        <GlassmorphCard className="p-6 space-y-6">
          <h3 className="text-white font-medium">Preferences</h3>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Moon size={16} className="text-white" />
              <p className="text-white">Dark Mode</p>
            </div>

            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </GlassmorphCard>

        {/* Logout */}
        <GlassmorphCard className="p-6">
          <Button
            onClick={onLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30 rounded-xl"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </GlassmorphCard>

        <div className="h-24"></div>
      </div>
    </div>
  );
}