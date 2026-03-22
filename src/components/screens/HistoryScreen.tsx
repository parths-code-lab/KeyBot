import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../../history";
import { GlassmorphCard } from "../GlassmorphCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";

export function HistoryScreen() {
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = getHistory();

    const formatted = history.map((item: any, index: number) => {
      const dateObj = new Date(item.date);

      return {
        id: index,
        query: item.query,
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString(),
        keywordsFound: Math.floor(Math.random() * 30) + 5,
        type:
          item.type === "image"
            ? "image-upload"
            : item.type === "competitor"
            ? "competitor-analysis"
            : "keyword-search",
      };
    });

    setSearchHistory(formatted);
  }, []);

  const getTypeIcon = (type: string) => {
    if (type === "image-upload") return "🖼️";
    if (type === "competitor-analysis") return "🌐";
    return "🔍";
  };

  const getTypeBadge = (type: string) => {
    if (type === "image-upload") return "Image Search";
    if (type === "competitor-analysis") return "Competitor Analysis";
    return "Keyword Search";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C63D2] via-[#6366F1] to-[#8B5CF6] dark:from-[#2A1B3D] dark:via-[#1F1832] dark:to-[#0F0C1C]">

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate("/")}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-white text-lg font-medium">
          Search History
        </h1>

        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 space-y-4">
        {searchHistory.length > 0 ? (
          searchHistory.map((item) => (
            <GlassmorphCard key={item.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {getTypeIcon(item.type)}
                      </span>
                      <h3 className="text-white font-medium">
                        {item.query}
                      </h3>
                    </div>

                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 rounded-full"
                    >
                      {getTypeBadge(item.type)}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-white/70">
                      <Calendar size={14} />
                      <span>
                        {item.date} at {item.time}
                      </span>
                    </div>

                    <div className="text-white/70">
                      <span>
                        {item.keywordsFound} keywords found
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-2">
                    Top Keywords:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "ai tools",
                      "marketing automation",
                      "seo optimization",
                    ].map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="bg-white/5 text-white/80 border-white/20 rounded-full text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </GlassmorphCard>
          ))
        ) : (
          <GlassmorphCard className="p-6 text-center">
            <p className="text-white/70">
              No search history yet
            </p>
          </GlassmorphCard>
        )}

        <div className="flex justify-center pt-6">
          <Button
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-8"
            variant="outline"
          >
            Load More History
          </Button>
        </div>

        <div className="h-24"></div>
      </div>
    </div>
  );
}