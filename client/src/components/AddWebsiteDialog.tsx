import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import type { Website, InsertWebsite } from "@shared/schema";

interface AddWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: InsertWebsite) => Promise<void>;
  editWebsite?: Website;
}

export default function AddWebsiteDialog({ isOpen, onClose, onSave, editWebsite }: AddWebsiteDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editWebsite) {
        setName(editWebsite.name);
        setUrl(editWebsite.url);
      } else {
        setName("");
        setUrl("");
      }
      setError("");
    }
  }, [isOpen, editWebsite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    try {
      new URL(url); // Validate URL
    } catch {
      setError("Invalid URL format");
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ name: name.trim(), url: url.trim() });
      setName("");
      setUrl("");
      onClose();
    } catch (err) {
      setError("Failed to save website");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editWebsite ? 'Edit Website' : 'Add New Website'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Website Name
              </Label>
              <Input
                id="name"
                placeholder="My Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                disabled={isLoading}
                data-testid="input-website-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                disabled={isLoading}
                data-testid="input-website-url"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400" data-testid="text-error">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              data-testid="button-save-website"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {editWebsite ? 'Save Changes' : 'Add Website'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
