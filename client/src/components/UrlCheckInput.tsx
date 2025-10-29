import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Signal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface UrlCheckInputProps {
  onCheck: (url: string) => void;
  isLoading?: boolean;
}

export default function UrlCheckInput({ onCheck, isLoading = false }: UrlCheckInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onCheck(url.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium text-gray-300">
              Website URL
            </label>
            <Input
              id="url-input"
              data-testid="input-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 h-12 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <Button
            data-testid="button-check-status"
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full h-12 rounded-xl font-medium text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Signal className="w-5 h-5 mr-2" />
                Check Status
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
