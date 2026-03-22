import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { useTheme } from "../ThemeProvider";
import {
  Search,
  Upload,
  TrendingUp,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";

interface DashboardScreenProps {
  username?: string;
}

export function DashboardScreen({
  username = "User"
}: DashboardScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      path: "/search",
      title: "Keyword Search",
      icon: Search,
      description: "Discover trending keywords",
      color: "from-[#4C63D2] to-[#6366F1]",
    },
    {
      path: "/image",
      title: "Image Upload",
      icon: Upload,
      description: "Extract keywords from images",
      color: "from-[#00C4B3] to-[#06D6C4]",
    },
    {
      path: "/competitor-analysis",
      title: "Competitor Analysis",
      icon: BarChart3,
      description: "Analyze competitor keywords",
      color: "from-[#A7B5E4] to-[#C4B5FD]",
    },
    {
      path: "/trends",
      title: "Trends",
      icon: TrendingUp,
      description: "View keyword trends",
      color: "from-[#F59E0B] to-[#F97316]",
    },
  ];
  
  return (
    
    <div className="min-h-screen">
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 mb-6">
        <div>
          <h1 className="text-white text-lg">Welcome,</h1>
          <h2 className="text-white text-xl font-medium">{username}</h2>
        </div>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6">

        {/* 🔥 Animated Feature Cards */}
        <motion.div
          className="grid grid-cols-1 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.35,
              },
            },
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassmorphCard
                  className="p-6 cursor-pointer transition-all duration-300"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-medium">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassmorphCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="h-24"></div>
    </div>
  );
}