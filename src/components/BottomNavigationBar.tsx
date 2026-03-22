import React from "react";
import { motion } from "framer-motion";
import { GlassmorphCard } from "./GlassmorphCard";
import { Home, History, Settings, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function BottomNavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Home",
    },
    {
      path: "/search",
      icon: Search,
      label: "Search",
    },
    {
      path: "/history",
      icon: History,
      label: "History",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <GlassmorphCard className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 p-3 px-6 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              
              <motion.div
                animate={{
                  scale: isActive ? 1.4 : 1,
                  y: isActive ? 9 : 0,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon size={20} />
              </motion.div>

              <div className="h-4 flex items-center justify-center">
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isActive ? 0 : 1,
                    y: isActive ? 5 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-xs"
                >
                  {item.label}
                </motion.span>
              </div>
            </button>
          );
        })}
      </GlassmorphCard>
    </div>
  );
}