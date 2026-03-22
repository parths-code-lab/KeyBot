import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addToHistory } from "../../history";
import { useTheme } from "../ThemeProvider";
import {
  ArrowLeft,
  Search,
  BarChart3,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

export function CompetitorAnalysisScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [competitorUrl, setCompetitorUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [topKeywords, setTopKeywords] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (!competitorUrl) return;

    setIsAnalyzing(true);

    try {
      let url = competitorUrl.trim();

      if (!url.startsWith("http")) {
        url = "https://" + url;
      }

      url = url.replace("http://", "https://");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/competitor_analysis?url=${encodeURIComponent(
          url
        )}`
      );

      const data = await res.json();

      addToHistory({
        type: "competitor",
        query: url,
      });

      setTopKeywords(data.keywords || []);
    } catch (err) {
      console.error("Error analyzing competitor:", err);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C] transition-all duration-500">
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-white text-lg font-medium">
          Competitor Analysis
        </h1>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 space-y-6">
        {/* Input Section */}
        <GlassmorphCard className="p-6">
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center space-x-2">
              <Globe size={20} className="text-[#00C4B3]" />
              <span>Enter Competitor URL</span>
            </h3>

            <div className="flex space-x-3">
              <Input
                type="url"
                placeholder="https://competitor.com"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAnalyze();
                }}
                className="flex-1 bg-white/10 border-white/20 text-white rounded-2xl h-12"
              />
              
              <Button
                onClick={handleAnalyze}
                disabled={!competitorUrl || isAnalyzing}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#00C4B3] to-[#06D6C4] text-white border-none"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search size={16} />
                    <span>Analyze</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </GlassmorphCard>

        {/* Results */}
        <GlassmorphCard className="p-6">
          <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
            <BarChart3 size={20} className="text-[#F59E0B]" />
            <span>Competitor Keywords</span>
          </h3>

          <div className="space-y-3">
            {topKeywords.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <h4 className="text-white font-medium">{item}</h4>
              </div>
            ))}

            {topKeywords.length === 0 && (
              <p className="text-white/60 text-sm">
                No competitor data yet
              </p>
            )}
          </div>
        </GlassmorphCard>

        <div className="h-24"></div>
      </div>
    </div>
  );
}