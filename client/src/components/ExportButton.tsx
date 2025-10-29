import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps {
  data: any;
  filename?: string;
}

export default function ExportButton({ data, filename = "sitepulse-results" }: ExportButtonProps) {
  const exportAsJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Exported as JSON');
  };

  const exportAsCSV = () => {
    const items = Array.isArray(data) ? data : [data];
    const headers = Object.keys(items[0] || {});
    const csv = [
      headers.join(','),
      ...items.map(item => headers.map(h => JSON.stringify(item[h] || '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Exported as CSV');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
          data-testid="button-export"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 border-white/20">
        <DropdownMenuItem 
          onClick={exportAsJSON}
          className="text-white hover:bg-white/10 cursor-pointer"
          data-testid="button-export-json"
        >
          <FileJson className="w-4 h-4 mr-2 text-blue-400" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsCSV}
          className="text-white hover:bg-white/10 cursor-pointer"
          data-testid="button-export-csv"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
