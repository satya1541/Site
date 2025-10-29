import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  isReachable: boolean;
  delay?: number;
}

export default function StatusBadge({ isReachable, delay = 0 }: StatusBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
    >
      <div className="flex items-center justify-center space-x-3">
        {isReachable ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p 
                className="text-2xl font-semibold text-green-400" 
                data-testid="text-status-reachable"
              >
                ✅ Reachable
              </p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-8 h-8 text-red-400" />
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p 
                className="text-2xl font-semibold text-red-400" 
                data-testid="text-status-unreachable"
              >
                ❌ Unreachable
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
