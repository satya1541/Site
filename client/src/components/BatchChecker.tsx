import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Signal, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface BatchCheckerProps {
  onCheck: (urls: string[]) => void;
  isLoading?: boolean;
}

export default function BatchChecker({ onCheck, isLoading = false }: BatchCheckerProps) {
  const [urls, setUrls] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urlList.length > 0) {
      onCheck(urlList);
    }
  };

  const urlCount = urls.split('\n').filter(url => url.trim().length > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="backdrop-blur-lg bg-white/5 border-white/10 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="urls-input" className="text-sm font-medium text-gray-300">
                Website URLs (one per line)
              </label>
              <span className="text-xs text-gray-400">
                {urlCount} {urlCount === 1 ? 'URL' : 'URLs'}
              </span>
            </div>
            <Textarea
              id="urls-input"
              data-testid="input-batch-urls"
              placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[200px] font-mono text-sm resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              data-testid="button-batch-check"
              type="submit"
              disabled={urlCount === 0 || isLoading}
              className="flex-1 h-12 rounded-xl font-medium text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Checking {urlCount} URLs...
                </>
              ) : (
                <>
                  <Signal className="w-5 h-5 mr-2" />
                  Check All URLs
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 rounded-xl border-white/20 text-white hover:bg-white/10"
              data-testid="button-export-template"
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
