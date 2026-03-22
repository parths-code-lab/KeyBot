import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNavigationBar } from "./components/BottomNavigationBar";

export function AppLayout() {
  const location = useLocation();

  const isSearchRoute =
    location.pathname.startsWith("/search");

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C]">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSearchRoute ? "search" : location.pathname}
          initial={isSearchRoute ? false : { scale: 0.97, opacity: 0 }}
          animate={isSearchRoute ? {} : { scale: 1, opacity: 1 }}
          exit={isSearchRoute ? {} : { scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      <BottomNavigationBar />
    </div>
  );
}