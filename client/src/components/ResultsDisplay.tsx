import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import MetricCard from "./MetricCard";
import DetailedMetrics, { DetailedCheckResult } from "./DetailedMetrics";
import ExportButton from "./ExportButton";
import { Clock, Server, Globe2, Lock, Code } from "lucide-react";

export interface CheckResult {
  url?: string;
  isReachable: boolean;
  responseTime: number;
  ipAddress: string;
  statusCode: number;
  sslValid: boolean;
  dnsTime?: number;
  tcpTime?: number;
  tlsTime?: number;
}

interface ResultsDisplayProps {
  result: CheckResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Results</h2>
        <ExportButton data={result} />
      </div>

      <StatusBadge isReachable={result.isReachable} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon={Clock}
          label="Response Time"
          value={`${result.responseTime} ms`}
          delay={0.1}
        />
        
        <MetricCard
          icon={Server}
          label="IP Address"
          value={result.ipAddress}
          delay={0.2}
        />
        
        <MetricCard
          icon={Code}
          label="HTTP Status"
          value={result.statusCode}
          valueClassName={result.statusCode >= 200 && result.statusCode < 300 ? "text-green-400" : "text-red-400"}
          delay={0.3}
        />
        
        <MetricCard
          icon={Lock}
          label="SSL Valid"
          value={result.sslValid ? "✓ Yes" : "✗ No"}
          valueClassName={result.sslValid ? "text-green-400" : "text-red-400"}
          delay={0.4}
        />
      </div>

      {(result.dnsTime || result.tcpTime || result.tlsTime) && (
        <DetailedMetrics result={result as DetailedCheckResult} />
      )}
    </motion.div>
  );
}
