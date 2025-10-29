import { Globe2, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  onSettingsClick?: () => void;
}

export default function Header({ activeTab, onTabChange, isDarkMode = true, onThemeToggle, onSettingsClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-lg bg-white/5 border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Globe2 className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-semibold text-white">SitePulse</h1>
          </div>

          <Tabs value={activeTab} onValueChange={onTabChange} className="hidden md:block">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger 
                value="dashboard" 
                data-testid="tab-dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white"
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            {onThemeToggle && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onThemeToggle}
                data-testid="button-theme-toggle"
                className="text-gray-400 hover:text-white"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={onSettingsClick}
              data-testid="button-settings"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
