import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, Zap, Shield, Activity } from "lucide-react";

export interface DetailedCheckResult {
  url: string;
  isReachable: boolean;
  responseTime: number;
  ipAddress: string;
  statusCode: number;
  sslValid: boolean;
  dnsTime?: number;
  tcpTime?: number;
  tlsTime?: number;
}

interface DetailedMetricsProps {
  result: DetailedCheckResult;
}

export default function DetailedMetrics({ result }: DetailedMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="backdrop-blur-md bg-white/5 border-white/10 p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Performance Breakdown</h3>
        
        <div className="space-y-4">
          {result.dnsTime !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-blue-400" />
                  DNS Lookup
                </span>
                <span className="text-sm font-mono text-white">{result.dnsTime}ms</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((result.dnsTime / result.responseTime) * 100, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                />
              </div>
            </div>
          )}

          {result.tcpTime !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-purple-400" />
                  TCP Connection
                </span>
                <span className="text-sm font-mono text-white">{result.tcpTime}ms</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((result.tcpTime / result.responseTime) * 100, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                />
              </div>
            </div>
          )}

          {result.tlsTime !== undefined && result.sslValid && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-400" />
                  TLS Handshake
                </span>
                <span className="text-sm font-mono text-white">{result.tlsTime}ms</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((result.tlsTime / result.responseTime) * 100, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-2">
                <Clock className="w-3 h-3 text-cyan-400" />
                Total Time
              </span>
              <span className="text-base font-mono font-semibold text-white">{result.responseTime}ms</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
