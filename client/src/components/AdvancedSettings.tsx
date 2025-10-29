import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export interface CheckOptions {
  timeout: number;
  followRedirects: boolean;
  validateSSL: boolean;
  customHeaders: string;
}

interface AdvancedSettingsProps {
  options: CheckOptions;
  onOptionsChange: (options: CheckOptions) => void;
}

export default function AdvancedSettings({ options, onOptionsChange }: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateOption = <K extends keyof CheckOptions>(key: K, value: CheckOptions[K]) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Card className="backdrop-blur-md bg-white/5 border-white/10">
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
          data-testid="button-toggle-settings"
        >
          <h3 className="text-sm font-medium text-white">Advanced Settings</h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout" className="text-sm text-gray-300">
                    Timeout (ms)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={options.timeout}
                    onChange={(e) => updateOption("timeout", parseInt(e.target.value))}
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-timeout"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="follow-redirects" className="text-sm text-gray-300">
                    Follow Redirects
                  </Label>
                  <Switch
                    id="follow-redirects"
                    checked={options.followRedirects}
                    onCheckedChange={(checked) => updateOption("followRedirects", checked)}
                    data-testid="switch-follow-redirects"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="validate-ssl" className="text-sm text-gray-300">
                    Validate SSL
                  </Label>
                  <Switch
                    id="validate-ssl"
                    checked={options.validateSSL}
                    onCheckedChange={(checked) => updateOption("validateSSL", checked)}
                    data-testid="switch-validate-ssl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-headers" className="text-sm text-gray-300">
                    Custom Headers (JSON)
                  </Label>
                  <Input
                    id="custom-headers"
                    placeholder='{"User-Agent": "SitePulse/1.0"}'
                    value={options.customHeaders}
                    onChange={(e) => updateOption("customHeaders", e.target.value)}
                    className="bg-white/5 border-white/20 text-white font-mono text-xs"
                    data-testid="input-custom-headers"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
