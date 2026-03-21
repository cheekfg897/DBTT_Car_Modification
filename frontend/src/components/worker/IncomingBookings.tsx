import { Clock, Play, CheckCircle, Inbox } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AppointmentCard } from './AppointmentCard';
import type { AppointmentBooking } from '../../types/booking';

const columns: { status: AppointmentBooking['status']; label: string; icon: typeof Clock }[] = [
  { status: 'pending',     label: 'New Bookings', icon: Clock },
  { status: 'in-progress', label: 'In Progress',  icon: Play },
  { status: 'done',        label: 'Completed',    icon: CheckCircle },
];

export function IncomingBookings() {
  const appointments = useStore((s) => s.appointments);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Inbox className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-bold text-white">Incoming Bookings</h2>
        <span className="ml-auto px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
          {appointments.length} total
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Inbox className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No bookings yet. They'll appear here once customers submit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(({ status, label, icon: Icon }) => {
            const items = appointments.filter((a) => a.status === status);
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-300">{label}</span>
                  <span className="ml-auto text-xs text-zinc-500">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map((a) => (
                    <AppointmentCard key={a.id} appointment={a} />
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-zinc-600 text-center py-6">None</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
