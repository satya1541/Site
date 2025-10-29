import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-slate-900/95 border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <DialogTitle className="text-xl">Settings</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Manage your SitePulse preferences and configurations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm text-gray-300">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                data-testid="switch-email-notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="browser-notifications" className="text-sm text-gray-300">
                Browser Notifications
              </Label>
              <Switch
                id="browser-notifications"
                data-testid="switch-browser-notifications"
              />
            </div>
          </div>

          <div className="h-px bg-white/10"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Display</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh" className="text-sm text-gray-300">
                Auto-refresh Dashboard
              </Label>
              <Switch
                id="auto-refresh"
                data-testid="switch-auto-refresh"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-animations" className="text-sm text-gray-300">
                Show Animations
              </Label>
              <Switch
                id="show-animations"
                defaultChecked
                data-testid="switch-show-animations"
              />
            </div>
          </div>

          <div className="h-px bg-white/10"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Monitoring</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="alert-on-down" className="text-sm text-gray-300">
                Alert When Site Goes Down
              </Label>
              <Switch
                id="alert-on-down"
                defaultChecked
                data-testid="switch-alert-on-down"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-4 border-t border-white/10">
          SitePulse v1.0.0
        </div>
      </DialogContent>
    </Dialog>
  );
}
