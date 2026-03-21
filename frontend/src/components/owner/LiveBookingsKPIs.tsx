import { Inbox, Clock, Wrench, CircleDollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SERVICES } from '../../data/services';

function estimateRevenue(serviceIds: string[]): number {
  return serviceIds.reduce((sum, id) => {
    const svc = SERVICES.find((s) => s.id === id);
    return sum + (svc?.minPrice ?? 0);
  }, 0);
}

export function LiveBookingsKPIs() {
  const appointments = useStore((s) => s.appointments);

  const active = appointments.filter((a) => a.status !== 'cancelled');
  const pending = active.filter((a) => a.status === 'pending');
  const inProgress = active.filter((a) => a.status === 'in-progress');
  const done = active.filter((a) => a.status === 'done');
  const totalRevenue = active.reduce((sum, a) => sum + estimateRevenue(a.services), 0);

  const cards = [
    {
      label: 'Pipeline Revenue (Est.)',
      value: `SGD ${totalRevenue.toLocaleString()}`,
      sub: 'Estimated from booked services',
      icon: CircleDollarSign,
      color: 'text-yellow-400',
    },
    {
      label: 'Pending',
      value: pending.length.toString(),
      sub: 'Awaiting start',
      icon: Inbox,
      color: 'text-yellow-400',
    },
    {
      label: 'In Progress',
      value: inProgress.length.toString(),
      sub: 'Currently being worked on',
      icon: Wrench,
      color: 'text-blue-400',
    },
    {
      label: 'Completed',
      value: done.length.toString(),
      sub: 'Jobs finished',
      icon: Clock,
      color: 'text-green-400',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Live Bookings</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
