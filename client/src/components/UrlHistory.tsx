import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, RotateCw, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: Date;
  isReachable: boolean;
  responseTime: number;
}

interface UrlHistoryProps {
  history: HistoryItem[];
  onRecheck: (url: string) => void;
  onClear: () => void;
}

export default function UrlHistory({ history, onRecheck, onClear }: UrlHistoryProps) {
  return (
    <Card className="backdrop-blur-md bg-white/5 border-white/10 h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Recent Checks
        </h3>
        {history.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="text-gray-400 hover:text-red-400 h-7"
            data-testid="button-clear-history"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No checks yet</p>
          ) : (
            history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-sm bg-white/5 rounded-lg p-3 hover-elevate"
                data-testid={`history-item-${index}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.isReachable ? (
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                      <p className="text-xs text-white truncate font-mono">{item.url}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{item.responseTime}ms</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRecheck(item.url)}
                    className="h-7 w-7 text-gray-400 hover:text-blue-400 flex-shrink-0"
                    data-testid={`button-recheck-${index}`}
                  >
                    <RotateCw className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
