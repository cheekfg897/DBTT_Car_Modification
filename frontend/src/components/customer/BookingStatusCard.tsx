import { Calendar, Clock, Car, MapPin, AlertTriangle, CheckCircle2, Wrench, XCircle } from 'lucide-react';
import type { AppointmentBooking } from '../../types/booking';
import { SERVICES } from '../../data/services';
import { StatusTimeline } from './StatusTimeline';

function getMaxDays(serviceIds: string[]): number {
  let max = 0;
  for (const id of serviceIds) {
    const svc = SERVICES.find((s) => s.id === id);
    if (!svc) continue;
    if (svc.duration.includes('2') && svc.duration.includes('3')) max = Math.max(max, 3);
    else if (svc.duration.includes('1') && svc.duration.includes('2')) max = Math.max(max, 2);
  }
  return max;
}

function getEstimatedDuration(serviceIds: string[]): string {
  const days = getMaxDays(serviceIds);
  if (days === 0) return 'Same day';
  if (days === 2) return '1–2 days';
  if (days === 3) return '2–3 days';
  return `${days} days`;
}

function getStatusMessage(apt: AppointmentBooking): { text: string; icon: React.ReactNode; color: string } {
  const now = new Date();
  const aptDate = new Date(`${apt.date}T${apt.timeSlot}:00`);
  const maxDays = getMaxDays(apt.services);
  const expectedDone = new Date(aptDate);
  expectedDone.setDate(expectedDone.getDate() + maxDays);

  if (apt.status === 'done') {
    return { text: 'Your car is ready for collection.', icon: <CheckCircle2 size={16} />, color: 'text-green-400' };
  }
  if (apt.status === 'cancelled') {
    return { text: 'This booking has been cancelled.', icon: <XCircle size={16} />, color: 'text-red-400' };
  }
  if (apt.status === 'in-progress') {
    if (now > expectedDone) {
      return {
        text: 'Running slightly behind schedule. We apologise for the delay.',
        icon: <AlertTriangle size={16} />,
        color: 'text-yellow-400',
      };
    }
    return {
      text: 'Your car is currently being worked on — on schedule.',
      icon: <Wrench size={16} />,
      color: 'text-orange-400',
    };
  }
  // pending
  const todayStr    = now.toISOString().slice(0, 10);
  const tomorrowStr = new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10);
  if (apt.date === todayStr) {
    return { text: 'Your appointment is today — the workshop is preparing your bay.', icon: <Clock size={16} />, color: 'text-orange-400' };
  }
  if (apt.date === tomorrowStr) {
    return { text: 'Your appointment is confirmed for tomorrow.', icon: <CheckCircle2 size={16} />, color: 'text-green-400' };
  }
  return { text: 'Your booking is confirmed.', icon: <CheckCircle2 size={16} />, color: 'text-green-400' };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-SG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

const LOGISTICS_LABELS: Record<string, string> = {
  'self-drive':     'Self-Drive',
  'pickup-dropoff': 'Pickup & Drop-off',
  'pickup-rental':  'Pickup & Rental Car',
};

const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  pending:     { label: 'Confirmed',    classes: 'bg-blue-500/15 text-blue-400' },
  'in-progress': { label: 'In Progress', classes: 'bg-orange-500/15 text-orange-400' },
  done:        { label: 'Completed',   classes: 'bg-green-500/15 text-green-400' },
  cancelled:   { label: 'Cancelled',   classes: 'bg-red-500/15 text-red-400' },
};

interface Props {
  appointment: AppointmentBooking;
}

export function BookingStatusCard({ appointment: apt }: Props) {
  const statusMsg  = getStatusMessage(apt);
  const duration   = getEstimatedDuration(apt.services);
  const serviceNames = apt.services.map((id) => SERVICES.find((s) => s.id === id)?.name ?? id);
  const badge      = STATUS_BADGE[apt.status] ?? STATUS_BADGE.pending;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 mb-0.5">Booking Reference</p>
          <p className="text-lg font-bold text-white">{apt.id}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      {/* Status message */}
      <div className={`px-5 py-3 flex items-center gap-2 border-b border-zinc-800 ${statusMsg.color}`}>
        {statusMsg.icon}
        <p className="text-sm">{statusMsg.text}</p>
      </div>

      {/* Timeline */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <StatusTimeline status={apt.status} />
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3.5">
        <div className="flex items-start gap-3">
          <Car size={15} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Vehicle</p>
            <p className="text-sm text-white">{apt.car} — {apt.carPlate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar size={15} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Appointment</p>
            <p className="text-sm text-white">{formatDate(apt.date)} at {apt.timeSlot}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock size={15} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Services & Estimated Duration</p>
            <p className="text-sm text-white">{serviceNames.join(', ')}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Estimated: {duration}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={15} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Logistics</p>
            <p className="text-sm text-white">{LOGISTICS_LABELS[apt.logistics] ?? apt.logistics}</p>
            {apt.pickupAddress && (
              <p className="text-xs text-zinc-400 mt-0.5">
                Pickup: {apt.pickupAddress}
                {apt.pickupTimePreference && ` (${apt.pickupTimePreference} preference)`}
              </p>
            )}
          </div>
        </div>

        {apt.notes && (
          <div className="pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Notes</p>
            <p className="text-sm text-zinc-300">{apt.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-zinc-800/50 text-xs text-zinc-500">
        For enquiries, contact us on{' '}
        <a
          href="https://wa.me/+6596123573"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:underline"
        >
          WhatsApp
        </a>.
      </div>
    </div>
  );
}
