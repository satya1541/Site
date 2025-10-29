import { useState } from "react";
import { Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import UrlCheckInput from "@/components/UrlCheckInput";
import ResultsDisplay, { CheckResult } from "@/components/ResultsDisplay";

export default function Home() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (url: string) => {
    setIsLoading(true);
    console.log('Checking URL:', url);
    
    // TODO: remove mock functionality - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: remove mock functionality - mock data for design preview
    const mockResult: CheckResult = {
      isReachable: Math.random() > 0.3,
      responseTime: Math.floor(Math.random() * 500) + 100,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      statusCode: Math.random() > 0.3 ? 200 : 500,
      sslValid: Math.random() > 0.2
    };
    
    setResult(mockResult);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
            >
              <Globe2 className="w-12 h-12 text-blue-400" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-semibold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            SitePulse
          </h1>
          <p className="text-lg text-gray-300">
            Check website availability in real-time
          </p>
        </motion.div>

        <UrlCheckInput onCheck={handleCheck} isLoading={isLoading} />

        {result && <ResultsDisplay result={result} />}
      </div>
    </div>
  );
}
