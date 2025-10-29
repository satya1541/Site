import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="space-y-4">
      <StatusBadge isReachable={true} />
      <StatusBadge isReachable={false} />
    </div>
  );
}
