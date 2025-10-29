import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { RotateCw, Plus, Globe, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import WebsiteCard, { WebsiteStatus } from "@/components/WebsiteCard";
import AddWebsiteDialog from "@/components/AddWebsiteDialog";
import type { Website, InsertWebsite, CheckResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editWebsite, setEditWebsite] = useState<Website | undefined>();
  const [statuses, setStatuses] = useState<Map<string, WebsiteStatus>>(new Map());
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: websites = [], isLoading } = useQuery<Website[]>({
    queryKey: ['/api/websites'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWebsite) => {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create website');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites'] });
      toast({ title: "Website added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertWebsite> }) => {
      const res = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update website');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites'] });
      toast({ title: "Website updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete website');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites'] });
      toast({ title: "Website deleted successfully" });
    },
  });

  const checkSingle = async (id: string) => {
    setCheckingIds(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/check/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to check website');
      const result: CheckResult = await res.json();
      
      setStatuses(prev => new Map(prev).set(id, {
        isReachable: result.isReachable,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        ipAddress: result.ipAddress,
        sslValid: result.sslValid,
        dnsTime: result.dnsTime,
        tcpTime: result.tcpTime,
        tlsTime: result.tlsTime,
        error: result.error,
        checkedAt: new Date(result.checkedAt!),
      }));
    } catch (error) {
      console.error('Error checking website:', error);
    } finally {
      setCheckingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const checkAll = async () => {
    setCheckingIds(new Set(websites.map(w => w.id)));
    try {
      const res = await fetch('/api/check-all', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to check websites');
      const results: CheckResult[] = await res.json();
      
      const newStatuses = new Map<string, WebsiteStatus>();
      results.forEach(result => {
        if (result.websiteId) {
          newStatuses.set(result.websiteId, {
            isReachable: result.isReachable,
            responseTime: result.responseTime,
            statusCode: result.statusCode,
            ipAddress: result.ipAddress,
            sslValid: result.sslValid,
            dnsTime: result.dnsTime,
            tcpTime: result.tcpTime,
            tlsTime: result.tlsTime,
            error: result.error,
            checkedAt: new Date(result.checkedAt!),
          });
        }
      });
      setStatuses(newStatuses);
    } catch (error) {
      console.error('Error checking websites:', error);
    } finally {
      setCheckingIds(new Set());
    }
  };

  const handleSave = async (data: InsertWebsite) => {
    if (editWebsite) {
      await updateMutation.mutateAsync({ id: editWebsite.id, data });
      setEditWebsite(undefined);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (website: Website) => {
    setEditWebsite(website);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setStatuses(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const metrics = useMemo(() => {
    const total = websites.length;
    let up = 0;
    let down = 0;
    let alerts = 0;

    statuses.forEach((status, id) => {
      if (status.isReachable) {
        up++;
        if (status.error || status.sslValid === false || (status.statusCode && (status.statusCode < 200 || status.statusCode >= 300))) {
          alerts++;
        }
      } else {
        down++;
      }
    });

    return { total, up, down, alerts };
  }, [websites.length, statuses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your websites in real-time</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-6"
        >
          <div className="flex items-center gap-2" data-testid="metric-total">
            <Globe className="w-4 h-4 text-blue-400" />
            <div className="text-center">
              <div className="text-xs text-gray-400">Total</div>
              <div className="text-xl font-bold text-white">{metrics.total}</div>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <div className="flex items-center gap-2" data-testid="metric-up">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <div className="text-center">
              <div className="text-xs text-gray-400">Up</div>
              <div className="text-xl font-bold text-green-400">{metrics.up}</div>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <div className="flex items-center gap-2" data-testid="metric-down">
            <XCircle className="w-4 h-4 text-red-400" />
            <div className="text-center">
              <div className="text-xs text-gray-400">Down</div>
              <div className="text-xl font-bold text-red-400">{metrics.down}</div>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <div className="flex items-center gap-2" data-testid="metric-alerts">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <div className="text-center">
              <div className="text-xs text-gray-400">Alerts</div>
              <div className="text-xl font-bold text-yellow-400">{metrics.alerts}</div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button
            onClick={checkAll}
            disabled={websites.length === 0 || checkingIds.size > 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            data-testid="button-check-all"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${checkingIds.size > 0 ? 'animate-spin' : ''}`} />
            Check All
          </Button>
          <Button
            onClick={() => {
              setEditWebsite(undefined);
              setIsDialogOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            data-testid="button-add-website"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : websites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <h3 className="text-xl font-medium text-white mb-2">No websites yet</h3>
          <p className="text-gray-400 mb-6">Add your first website to start monitoring</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {websites.map((website, index) => (
            <WebsiteCard
              key={website.id}
              website={website}
              status={statuses.get(website.id)}
              isChecking={checkingIds.has(website.id)}
              onCheck={checkSingle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}

      <AddWebsiteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditWebsite(undefined);
        }}
        onSave={handleSave}
        editWebsite={editWebsite}
      />
    </div>
  );
}
