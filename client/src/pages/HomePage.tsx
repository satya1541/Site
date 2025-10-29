import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import UrlCheckInput from "@/components/UrlCheckInput";
import BatchChecker from "@/components/BatchChecker";
import ResultsDisplay, { CheckResult } from "@/components/ResultsDisplay";
import UrlHistory, { HistoryItem } from "@/components/UrlHistory";
import AdvancedSettings, { CheckOptions } from "@/components/AdvancedSettings";
import { TabsContent, Tabs } from "@/components/ui/tabs";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("single");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [options, setOptions] = useState<CheckOptions>({
    timeout: 5000,
    followRedirects: true,
    validateSSL: true,
    customHeaders: ''
  });

  const handleSingleCheck = async (url: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, options }),
      });

      if (!response.ok) {
        throw new Error('Failed to check URL');
      }

      const checkResult: CheckResult = await response.json();
      setResult(checkResult);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        url,
        timestamp: new Date(),
        isReachable: checkResult.isReachable,
        responseTime: checkResult.responseTime
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error checking URL:', error);
      setResult({
        url,
        isReachable: false,
        responseTime: 0,
        ipAddress: 'Error',
        statusCode: 0,
        sslValid: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchCheck = async (urls: string[]) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/check/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls, options }),
      });

      if (!response.ok) {
        throw new Error('Failed to check URLs');
      }

      const data = await response.json();
      console.log('Batch check completed:', data);
      
      // Add all results to history
      const newHistoryItems: HistoryItem[] = data.results.map((result: CheckResult, index: number) => ({
        id: `${Date.now()}-${index}`,
        url: result.url,
        timestamp: new Date(),
        isReachable: result.isReachable,
        responseTime: result.responseTime
      }));
      
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Error checking batch URLs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecheck = (url: string) => {
    setActiveTab("single");
    handleSingleCheck(url);
  };

  const handleClearHistory = () => {
    setHistory([]);
    console.log('History cleared');
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
      <div className="relative z-10">
        <Header 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isDarkMode={true}
        />

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="single">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <UrlCheckInput onCheck={handleSingleCheck} isLoading={isLoading} />
                  {result && <ResultsDisplay result={result} />}
                </div>
                
                <div className="space-y-6">
                  <AdvancedSettings options={options} onOptionsChange={setOptions} />
                  <UrlHistory 
                    history={history} 
                    onRecheck={handleRecheck}
                    onClear={handleClearHistory}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batch">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BatchChecker onCheck={handleBatchCheck} isLoading={isLoading} />
                </div>
                
                <div className="space-y-6">
                  <AdvancedSettings options={options} onOptionsChange={setOptions} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-3xl mx-auto">
                <UrlHistory 
                  history={history} 
                  onRecheck={handleRecheck}
                  onClear={handleClearHistory}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
