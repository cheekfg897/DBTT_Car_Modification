import { useStore } from '../../store/useStore';
import { JobCard } from './JobCard';
import type { BookingStatus } from '../../types/booking';
import { Clock, Play, CheckCircle } from 'lucide-react';

const columns: { status: BookingStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Pending', icon: Clock },
  { status: 'in-progress', label: 'In Progress', icon: Play },
  { status: 'done', label: 'Completed', icon: CheckCircle },
];

export function StatusTracker() {
  const bookings = useStore((s) => s.bookings);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Active Bookings</h2>
      <div className="grid grid-cols-3 gap-4">
        {columns.map(({ status, label, icon: Icon }) => {
          const items = bookings.filter((b) => b.status === status);
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                <Icon className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">{label}</span>
                <span className="ml-auto text-xs text-zinc-500">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((b) => (
                  <JobCard key={b.id} booking={b} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
