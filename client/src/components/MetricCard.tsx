import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  valueClassName?: string;
  delay?: number;
}

export default function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  valueClassName = "text-white",
  delay = 0 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover-elevate"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className={`text-xl font-semibold font-mono truncate ${valueClassName}`} data-testid={`text-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
