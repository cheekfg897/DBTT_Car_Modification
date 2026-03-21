import { Clock, Play, CheckCircle, ArrowRight, Car, Calendar, MapPin } from 'lucide-react';
import type { AppointmentBooking } from '../../types/booking';
import { useStore } from '../../store/useStore';
import { getServiceName } from '../../data/services';

const statusConfig = {
  'pending':    { label: 'New',         color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock },
  'in-progress':{ label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',       icon: Play },
  'done':       { label: 'Completed',   color: 'bg-green-500/10 text-green-400 border-green-500/30',    icon: CheckCircle },
  'cancelled':  { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/30',          icon: Clock },
};

const logisticsLabel: Record<string, string> = {
  'self-drive':      'Self-Drive',
  'pickup-dropoff':  'Pickup & Drop-off',
  'pickup-rental':   'Pickup + Rental',
};

function formatTime(slot: string) {
  const [h] = slot.split(':').map(Number);
  return h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
}

interface Props {
  appointment: AppointmentBooking;
}

export function AppointmentCard({ appointment: a }: Props) {
  const updateAppointmentStatus = useStore((s) => s.updateAppointmentStatus);
  const config = statusConfig[a.status] ?? statusConfig['pending'];
  const Icon = config.icon;

  const handleAdvance = () => {
    if (a.status === 'pending') updateAppointmentStatus(a.id, 'in-progress');
    else if (a.status === 'in-progress') updateAppointmentStatus(a.id, 'done');
  };

  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{a.customerName}</p>
          <p className="text-xs text-zinc-500">{a.phone}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium shrink-0 ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>

      {/* Car */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Car className="w-3.5 h-3.5 shrink-0" />
        <span>{a.car} · {a.carPlate}</span>
      </div>

      {/* Date & time */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Calendar className="w-3.5 h-3.5 shrink-0" />
        <span>
          {new Date(a.date + 'T00:00:00').toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}{formatTime(a.timeSlot)}
        </span>
      </div>

      {/* Logistics */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span>{logisticsLabel[a.logistics] ?? a.logistics}{a.pickupAddress ? ` — ${a.pickupAddress}` : ''}</span>
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-1">
        {a.services.map((id) => (
          <span key={id} className="px-2 py-0.5 bg-zinc-700/60 rounded text-xs text-zinc-300">
            {getServiceName(id)}
          </span>
        ))}
      </div>

      {/* Notes */}
      {a.notes && (
        <p className="text-xs text-zinc-500 italic border-t border-zinc-700/50 pt-2">{a.notes}</p>
      )}

      {/* Action */}
      {(a.status === 'pending' || a.status === 'in-progress') && (
        <div className="flex justify-end pt-1">
          <button
            onClick={handleAdvance}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold rounded-md transition-colors"
          >
            {a.status === 'pending' ? 'Start Job' : 'Mark Done'}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
