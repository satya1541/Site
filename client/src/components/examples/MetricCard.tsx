import MetricCard from '../MetricCard';
import { Clock } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="space-y-4">
      <MetricCard 
        icon={Clock} 
        label="Response Time" 
        value="245 ms" 
      />
    </div>
  );
}
