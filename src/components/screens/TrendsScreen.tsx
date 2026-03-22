import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { useTheme } from "../ThemeProvider";
import {
  ArrowLeft,
  Moon,
  Sun,
  TrendingUp,
  LayoutGrid,
  Landmark,
  Clapperboard,
  BookUser,
  LaptopMinimal,
  Trophy,
  TrendingDown,
  BarChart3,
  RefreshCw,
} from "lucide-react";

export function TrendsScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trendingKeywords, setTrendingKeywords] = useState<any[]>([]);

  const add_data = async () => {
    const url = selectedCategory
      ? `${import.meta.env.VITE_API_URL}/trending_now?category=${selectedCategory}`
      : `${import.meta.env.VITE_API_URL}/trending_now`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTrendingKeywords(data);
      })
      .catch((err) => {
        console.error("Error loading trending data", err);
      });
  };

  useEffect(() => {
    add_data();
  }, [selectedCategory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch("import.meta.env.VITE_API_URL/import");
      await add_data();
    } catch (error) {
      console.error("Error executing script:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const categoryTrends = [
    { category: "Technology", color: "from-[#4C63D2] to-[#6366F1]", sign: LaptopMinimal },
    { category: "Jobs and Education", color: "from-[#00C4B3] to-[#06D6C4]", sign: BookUser },
    { category: "Entertainment", color: "from-[#F59E0B] to-[#F97316]", sign: Clapperboard },
    { category: "Business and Finance", color: "from-[#8B5CF6] to-[#A78BFA]", sign: Landmark },
    { category: "Sports", color: "from-[#4C63D2] to-[#6366F1]", sign: Trophy },
    { category: "All Categories", color: "from-[#A7B5E4] to-[#C4B5FD]", sign: LayoutGrid },
  ];

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

        <h1 className="text-white text-lg font-medium">
          Trending Keywords
        </h1>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 space-y-6">

        {/* Category Section */}
        <GlassmorphCard className="p-6">
          <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
            <BarChart3 size={20} className="text-[#F59E0B]" />
            <span>Category Growth</span>
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {categoryTrends.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedCategory(
                    item.category === "All Categories" ? null : item.category
                  )
                }
                className="w-full text-left hover:scale-[1.02] transition-all duration-200"
              >
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center h-full">

                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-3`}
                  >
                    <item.sign size={24} className="text-white" />
                  </div>
                              
                  <h4 className="text-white font-medium text-sm leading-tight">
                    {item.category}
                  </h4>
                              
                </div>
              </button>
            ))}
          </div>
        </GlassmorphCard>

        {/* Trending Keywords */}
        <GlassmorphCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <TrendingUp size={20} className="text-[#00C4B3]" />
              <span>Hot Keywords</span>
            </h3>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 rounded-3xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-100"
            >
              <RefreshCw
                size={20}
                className={`${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="space-y-3">
            {trendingKeywords.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-white font-medium">
                      {item.keyword}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-lg">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">
                    {item.searches} searches
                  </p>
                </div>

                <div
                  className={`flex items-center space-x-1 ${
                    item.trend === "up"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.trend === "up" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span className="font-medium">{item.change}</span>
                </div>
              </div>
            ))}

            {trendingKeywords.length === 0 && (
              <p className="text-white/60 text-sm">
                No trending data available
              </p>
            )}
          </div>
        </GlassmorphCard>

        <div className="h-24"></div>
      </div>
    </div>
  );
}