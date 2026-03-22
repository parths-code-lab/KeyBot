import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlassmorphCard } from "../GlassmorphCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useTheme } from "../ThemeProvider";
import {
  ArrowLeft,
  Upload,
  Moon,
  Sun,
} from "lucide-react";

export function ImageUploadScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedKeywords, setExtractedKeywords] = useState<any[]>([]);
  

  const processImage = async (imageData: string) => {
    try {
      setIsProcessing(true);
      setProcessingProgress(30);
      setProcessingStep("Uploading image to server...");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      setProcessingProgress(70);
      setProcessingStep("Processing with AI...");

      const data = await response.json();

      setProcessingProgress(100);
      setProcessingStep("Finalizing results...");

      setExtractedKeywords(data.keywords || []);
    } catch (error) {
      console.error(error);
      setUploadError("Failed to analyze image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPG, PNG, GIF, or WebP)";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 10MB";
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    setUploadError(null);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setUploadedImage(null);
      setExtractedKeywords([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setUploadedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setUploadedImage(null);
      setExtractedKeywords([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setUploadedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const getRelevance = (confidence: number) => {
    if (confidence >= 90) return "Very High";
    if (confidence >= 75) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setExtractedKeywords([]);
    setProcessingProgress(0);
    setUploadError(null);
  };

  const handleKeywordClick = (keyword: string) => {
    navigate(`/search/${encodeURIComponent(keyword)}`);
  };

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

        <h1 className="text-white text-lg font-medium">Image Upload</h1>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="relative z-10 px-6 space-y-6">

        {/* Upload Area */}
        <GlassmorphCard className="p-8">
          {!uploadedImage ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? "border-[#00C4B3] bg-[#00C4B3]/10 scale-[1.02]"
                  : "border-white/30 hover:border-white/50 hover:bg-white/5"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload size={62} className="text-white mx-auto mb-4" />
              <p className="text-white/70 text-sm">
                Drag & drop or click to upload
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-48 object-cover rounded-xl"
              />
              <Button
                onClick={handleRemoveImage}
                variant="outline"
                className="w-full bg-white/10 text-white border-white/20"
              >
                Remove
              </Button>
            </div>
          )}
          {uploadError && (
            <p className="text-red-400 text-sm mt-3 text-center">
              {uploadError}
            </p>
          )}
        </GlassmorphCard>

        {/* Processing */}
        {isProcessing && (
          <GlassmorphCard className="p-6">
            <Progress value={processingProgress} />
            <p className="text-white/70 text-sm mt-2">
              {processingStep}
            </p>
          </GlassmorphCard>
        )}

        {/* Extracted Keywords */}
        {uploadedImage && extractedKeywords.length > 0 && !isProcessing && (
          <div className="space-y-3">
            {extractedKeywords.map((item, index) => (
              <GlassmorphCard
                key={index}
                onClick={() => handleKeywordClick(item.keyword)}
                className="p-4 cursor-pointer hover:bg-white/15"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">
                      {item.keyword}
                    </h4>
                    <p className="text-white/70 text-sm">
                      {getRelevance(item.confidence)} relevance
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {item.confidence}%
                  </Badge>
                </div>
              </GlassmorphCard>
            ))}
          </div>
        )}

        <div className="h-24"></div>
      </div>
    </div>
  );
}