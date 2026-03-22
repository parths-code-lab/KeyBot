import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { AppLayout } from "./AppLayout";

import { DashboardScreen } from "./components/screens/DashboardScreen";
import { KeywordSearchScreen } from "./components/screens/KeywordSearchScreen";
import { HistoryScreen } from "./components/screens/HistoryScreen";
import { ImageUploadScreen } from "./components/screens/ImageUploadScreen";
import { SettingsScreen } from "./components/screens/SettingsScreen";
import { CompetitorAnalysisScreen } from "./components/screens/CompetitorAnalysisScreen";
import { TrendsScreen } from "./components/screens/TrendsScreen";
import { LoginScreen } from "./components/screens/LoginScreen";
import { SignupScreen } from "./components/screens/SignupScreen";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C] text-white">Loading...</div>;
  }

  const username =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const email = user?.email || "";

  return (
    <ThemeProvider>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route
          path="/"
          element={
            !user ? (
              <LoginScreen />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !user ? (
              <SignupScreen />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* PRIVATE ROUTES */}
        <Route
          element={
            user ? <AppLayout /> : <Navigate to="/" />
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardScreen username={username} />}
          />

          <Route path="/search" element={<KeywordSearchScreen />} />
          <Route path="/search/:keyword" element={<KeywordSearchScreen />} />
          <Route path="/image" element={<ImageUploadScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/competitor-analysis" element={<CompetitorAnalysisScreen />} />
          <Route path="/trends" element={<TrendsScreen />} />

          <Route
            path="/settings"
            element={
              <SettingsScreen
                username={username}
                email={email}
                onLogout={handleLogout}
              />
            }
          />
        </Route>

      </Routes>
    </ThemeProvider>
  );
}