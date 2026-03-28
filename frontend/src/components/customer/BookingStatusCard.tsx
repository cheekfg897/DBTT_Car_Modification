import { Calendar, Clock, Car, MapPin, AlertTriangle, CheckCircle2, Wrench, XCircle } from 'lucide-react';
import type { AppointmentBooking } from '../../types/booking';
import { SERVICES } from '../../data/services';
import { StatusTimeline } from './StatusTimeline';

const WHATSAPP_NUMBER = '+6596123573';

function collectionWhatsAppUrl(apt: AppointmentBooking): string {
  const msg = apt.logistics === 'self-drive'
    ? `Hi VOS, I'd like to arrange collection for booking ${apt.id} (${apt.car} · ${apt.carPlate}). When can I come in?`
    : `Hi VOS, I see my car for booking ${apt.id} (${apt.car} · ${apt.carPlate}) is ready. Please arrange return to ${apt.pickupAddress ?? 'my address'}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

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

      {/* Collection CTA — shown only when ready */}
      {apt.status === 'done' && (
        <div className="px-5 py-4 border-t border-zinc-800 bg-green-500/5">
          <p className="text-xs text-zinc-400 mb-3">
            {apt.logistics === 'self-drive'
              ? 'Your car is ready. WhatsApp us to arrange a time to come in.'
              : 'Your car is ready. WhatsApp us to arrange return delivery.'}
          </p>
          <a
            href={collectionWhatsAppUrl(apt)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-black transition-colors"
            style={{ background: '#25d366' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp to Arrange Collection
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-zinc-800/50 text-xs text-zinc-500">
        For other enquiries, contact us on{' '}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
