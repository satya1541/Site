import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Loader2, Trash2, Pencil, RotateCw, Globe2, Lock, Activity, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import type { Website } from "@shared/schema";
import successVideo from "@assets/successnew_1761551148917.mp4";
import failureVideo from "@assets/failurenew_1761550641787.mp4";

export interface WebsiteStatus {
  isReachable: boolean;
  responseTime: number;
  statusCode: number;
  ipAddress?: string;
  sslValid?: boolean;
  dnsTime?: number;
  tcpTime?: number;
  tlsTime?: number;
  error?: string;
  checkedAt?: Date;
}

interface WebsiteCardProps {
  website: Website;
  status?: WebsiteStatus;
  isChecking?: boolean;
  onCheck: (id: string) => void;
  onEdit: (website: Website) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export default function WebsiteCard({ 
  website, 
  status, 
  isChecking = false,
  onCheck,
  onEdit,
  onDelete,
  delay = 0
}: WebsiteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoType, setVideoType] = useState<'success' | 'failure'>('success');
  const previousIsChecking = useRef(isChecking);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faviconSrc, setFaviconSrc] = useState<string>('');
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    const extractDomain = (url: string) => {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname;
      } catch {
        return url.split('/')[0];
      }
    };

    const domain = extractDomain(website.url);
    
    if (website.faviconUrl) {
      setFaviconSrc(website.faviconUrl);
    } else {
      setFaviconSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    }
    setFaviconError(false);
  }, [website.url, website.faviconUrl]);

  const handleFaviconError = () => {
    if (faviconError) return;
    
    const extractDomain = (url: string) => {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname;
      } catch {
        return url.split('/')[0];
      }
    };

    const domain = extractDomain(website.url);

    if (faviconSrc === website.faviconUrl) {
      setFaviconSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    } else if (faviconSrc.includes('duckduckgo.com')) {
      setFaviconSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else if (faviconSrc.includes('google.com')) {
      const baseUrl = website.url.startsWith('http') ? website.url.split('/').slice(0, 3).join('/') : `https://${website.url.split('/')[0]}`;
      setFaviconSrc(`${baseUrl}/favicon.ico`);
    } else {
      setFaviconError(true);
    }
  };

  useEffect(() => {
    if (previousIsChecking.current === true && isChecking === false && status) {
      const isSuccess = status.isReachable && status.statusCode >= 200 && status.statusCode < 300;
      setVideoType(isSuccess ? 'success' : 'failure');
      setShowVideo(true);

      const timer = setTimeout(() => {
        setShowVideo(false);
      }, 5000);

      previousIsChecking.current = isChecking;
      return () => clearTimeout(timer);
    }
    previousIsChecking.current = isChecking;
  }, [isChecking]);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => {
        console.error('Video play error:', err);
        console.log('Video type:', videoType);
        console.log('Video src:', videoRef.current?.src);
      });
    }
  }, [showVideo, videoType]);

  const handleDeleteConfirm = () => {
    onDelete(website.id);
    setShowDeleteDialog(false);
  };

  const getTextColor = () => {
    if (!status) return 'text-white';
    return status.isReachable && status.statusCode >= 200 && status.statusCode < 300
      ? 'text-green-400'
      : 'text-red-400';
  };

  const textColor = getTextColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="backdrop-blur-md bg-white/5 border-white/10 p-3 hover-elevate relative overflow-hidden">
        {showVideo && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <video
              ref={videoRef}
              src={videoType === 'success' ? successVideo : failureVideo}
              className="w-full h-full object-cover rounded-lg"
              muted
              autoPlay
              playsInline
              data-testid={`video-${videoType}-${website.id}`}
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {isChecking && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              )}
              {faviconSrc && !faviconError && (
                <img 
                  src={faviconSrc} 
                  alt={`${website.name} favicon`}
                  className="w-4 h-4 rounded flex-shrink-0"
                  data-testid={`img-favicon-${website.id}`}
                  onError={handleFaviconError}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold truncate ${textColor}`} data-testid={`text-website-name-${website.id}`}>
                  {website.name}
                </h3>
                <p className={`text-xs truncate font-mono ${textColor}`} data-testid={`text-website-url-${website.id}`}>
                  {website.url}
                </p>
              </div>
            </div>

            {status && (
              <div className="mt-2 space-y-1 h-[88px]">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${textColor}`} />
                    <span className={`font-mono font-semibold ${textColor}`}>
                      {status.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={textColor}>•</span>
                    <span className={`font-mono font-semibold ${textColor}`}>
                      {status.statusCode || 'N/A'}
                    </span>
                  </div>
                  {status.sslValid !== undefined && (
                    <div className="flex items-center gap-1">
                      <Lock className={`w-3 h-3 ${textColor}`} />
                    </div>
                  )}
                  {status.checkedAt && (
                    <span className={`text-xs ml-auto ${textColor}`}>
                      {new Date(status.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap min-h-[20px]">
                  {status.ipAddress && (
                    <div className="flex items-center gap-1">
                      <Globe2 className={`w-3 h-3 ${textColor}`} />
                      <span className={`font-mono text-xs ${textColor}`}>
                        {status.ipAddress}
                      </span>
                    </div>
                  )}
                  {status.dnsTime !== undefined && (
                    <div className="flex items-center gap-1">
                      <Activity className={`w-3 h-3 ${textColor}`} />
                      <span className={`font-mono ${textColor}`}>{status.dnsTime}ms</span>
                    </div>
                  )}
                  {status.tcpTime !== undefined && (
                    <div className="flex items-center gap-1">
                      <Zap className={`w-3 h-3 ${textColor}`} />
                      <span className={`font-mono ${textColor}`}>{status.tcpTime}ms</span>
                    </div>
                  )}
                  {status.tlsTime !== undefined && (
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3 h-3 ${textColor}`} />
                      <span className={`font-mono ${textColor}`}>{status.tlsTime}ms</span>
                    </div>
                  )}
                </div>

                <div className="min-h-[36px]">
                  {status.error && (
                    <div className={`text-xs ${textColor} bg-red-500/10 border border-red-500/20 rounded px-2 py-1 line-clamp-2`}>
                      {status.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onCheck(website.id)}
              disabled={isChecking}
              className="text-gray-400 hover:text-blue-400 h-7 w-7"
              data-testid={`button-check-${website.id}`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(website)}
              className="text-gray-400 hover:text-blue-400 h-7 w-7"
              data-testid={`button-edit-${website.id}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="text-gray-400 hover:text-red-400 h-7 w-7"
              data-testid={`button-delete-${website.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="backdrop-blur-xl bg-slate-900/95 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-white">{website.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              data-testid={`button-cancel-delete-${website.id}`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              data-testid={`button-confirm-delete-${website.id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
