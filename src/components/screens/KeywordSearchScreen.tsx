import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useTheme } from "../ThemeProvider";
import { addToHistory } from "../../history";
import { ArrowLeft, Search, Moon, Sun } from "lucide-react";

export function KeywordSearchScreen() {
  const navigate = useNavigate();
  const { keyword } = useParams();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState<any[]>([]);

  const fetchKeywords = async (query: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search_value?q=${encodeURIComponent(query)}`
      );
      

      const data = await response.json();
      setKeywords(data);

      addToHistory({
        type: "keyword",
        query,
      });
    } catch (err) {
      console.error("Error loading trending data", err);
    }
  };

  useEffect(() => {
    if (keyword) {
      setSearchQuery(keyword);
      fetchKeywords(keyword);
    }
  }, [keyword]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Enter a topic");
      return;
    }

    setError("");
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const suggestedKeywords = [
    "AI tools for business",
    "ChatGPT alternatives",
    "AI content writing",
    "SEO for beginners",
    "YouTube SEO tips",
    "AI marketing strategies",
    "E-commerce SEO",
    "Digital marketing trends",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C]">

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-white text-lg font-medium">
          Keyword Research
        </h1>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 space-y-4">

        {/* Search Box */}
        <GlassmorphCard className="p-6">
          <div className="relative flex items-center">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"
              size={20}
            />
            <Input
              type="text"
              value={searchQuery}
              placeholder="Enter a topic or domain"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="pl-12 bg-white/10 border-white/20 text-white rounded-2xl h-12"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">
              {error}
            </p>
          )}
        </GlassmorphCard>

        {/* Suggested Keywords */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Suggested Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((item) => (
              <Badge
                key={item}
                onClick={() =>
                  navigate(`/search/${encodeURIComponent(item)}`)
                }
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-4 py-2 cursor-pointer"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.map((item, index) => (
              <GlassmorphCard key={index} className="p-4">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">
                    {item?.term ?? "N/A"}
                  </h4>

                  <Badge variant="secondary">
                    {item?.strength ?? "N/A"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                  <div>
                    <span className="text-white/70">Est. Volume</span>
                    <p className="text-white font-medium">
                      {item?.volume ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-white/70">Interest Score</span>
                    <p className="text-white font-medium">
                      {item?.score ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-white/70">Trend Strength</span>
                    <p className="text-white font-medium">
                      {item?.strength ?? "N/A"}
                    </p>
                  </div>
                </div>
              </GlassmorphCard>
            ))
          ) : (
            <GlassmorphCard className="p-6 text-center">
              <p className="text-white/70">
                No Keyword data available
              </p>
            </GlassmorphCard>
          )}
        </div>

        <div className="h-24"></div>
      </div>
    </div>
  );
}