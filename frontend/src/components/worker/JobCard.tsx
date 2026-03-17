import type { Booking, BookingStatus } from '../../types/booking';
import { getMod } from '../../utils/dataLookup';
import { Clock, Play, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: typeof Clock }> = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: Play },
  'done': { label: 'Completed', color: 'bg-green-500/10 text-green-500 border-green-500/30', icon: CheckCircle },
};

interface JobCardProps {
  booking: Booking;
}

export function JobCard({ booking }: JobCardProps) {
  const advanceBookingStatus = useStore((s) => s.advanceBookingStatus);
  const config = statusConfig[booking.status];
  const Icon = config.icon;

  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-white">{booking.customerName}</p>
          <p className="text-xs text-zinc-500">{booking.car}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {booking.mods.map((modId) => {
          const mod = getMod(modId);
          return (
            <span key={modId} className="px-2 py-0.5 bg-zinc-700/50 rounded text-xs text-zinc-300">
              {mod?.name || modId}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>{booking.date}</span>
          <span className="font-semibold text-orange-accent">SGD {booking.totalPrice.toLocaleString()}</span>
        </div>

        {booking.status !== 'done' && (
          <button
            onClick={() => advanceBookingStatus(booking.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-accent hover:bg-orange-hover text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            {booking.status === 'pending' ? 'Start' : 'Complete'}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {booking.notes && (
        <p className="mt-2 text-xs text-zinc-500 italic border-t border-zinc-700/50 pt-2">{booking.notes}</p>
      )}
    </div>
  );
}
