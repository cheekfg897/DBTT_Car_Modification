import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Car, Truck, RefreshCw,
  Check, ArrowLeft, Calendar, Clock, MapPin, User,
  Phone, Mail, FileText, CheckCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { AppointmentBooking, LogisticsType } from '../types/booking';

const GOLD = '#f6bd2d';

const SERVICES = [
  { id: 'car-wrap', name: 'Car Wraps', desc: 'Full or partial vinyl wrap in any finish', duration: '1–2 days', price: 'From $800' },
  { id: 'spray-paint', name: 'Spray Paint', desc: 'Full respray or panel painting', duration: '2–3 days', price: 'From $600' },
  { id: 'solar-tint', name: 'Solar Film Tinting', desc: 'UV & heat rejection window film', duration: 'Same day', price: 'From $250' },
  { id: 'bodykit', name: 'Bodykit Installation', desc: 'Front/rear bumper & side skirt kits', duration: '1–2 days', price: 'From $1,200' },
  { id: 'ppf', name: 'Paint Protection Film', desc: 'Self-healing transparent film', duration: '1–2 days', price: 'From $1,500' },
  { id: 'graphic-design', name: 'Graphic Design', desc: 'Custom livery & decal design', duration: '1–2 days', price: 'From $400' },
  { id: 'exhaust', name: 'Exhaust System', desc: 'Cat-back, valved & titanium systems', duration: 'Same day', price: 'From $800' },
  { id: 'spoiler', name: 'Spoiler', desc: 'Ducktail, GT-wing & swan-neck options', duration: 'Same day', price: 'From $350' },
  { id: 'hood', name: 'Hood Modification', desc: 'Carbon fibre & vented hood upgrades', duration: 'Same day', price: 'From $600' },
  { id: 'sideskirt', name: 'Side Skirts', desc: 'Sport & carbon side skirt fitment', duration: 'Same day', price: 'From $450' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const BOOKED_SLOTS: Record<string, string[]> = {
  '2026-03-17': ['09:00', '10:00', '11:00'],
  '2026-03-18': ['09:00', '10:00', '11:00', '12:00', '13:00'],
  '2026-03-19': ['10:00', '14:00', '15:00'],
  '2026-03-20': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  '2026-03-24': ['09:00', '10:00', '11:00', '12:00'],
  '2026-03-25': ['14:00', '15:00', '16:00', '17:00'],
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const STEP_LABELS = ['Services', 'Date & Time', 'Logistics', 'Details', 'Confirm'];

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  services: string[];
  date: string;
  time: string;
  logistics: LogisticsType;
  pickupAddress: string;
  pickupTimePreference: 'morning' | 'afternoon';
  customerName: string;
  email: string;
  phone: string;
  carModel: string;
  carPlate: string;
  notes: string;
}

function formatTime(slot: string) {
  const [h] = slot.split(':').map(Number);
  return h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
}

// Map customization mods/features → service IDs
function inferServicesFromDesign(customization: { finishType: string; windowTint: number; selectedMods: string[] }): string[] {
  const services: string[] = [];
  if (customization.finishType === 'chrome') services.push('car-wrap');
  else services.push('spray-paint');
  if (customization.windowTint > 0) services.push('solar-tint');
  if (customization.selectedMods.some((m) => m.startsWith('spoiler'))) services.push('spoiler');
  if (customization.selectedMods.some((m) => m.startsWith('exhaust'))) services.push('exhaust');
  if (customization.selectedMods.some((m) => m.startsWith('bodykit'))) services.push('bodykit');
  if (customization.selectedMods.some((m) => m.startsWith('hood'))) services.push('hood');
  if (customization.selectedMods.some((m) => m.startsWith('sideskirt'))) services.push('sideskirt');
  return services;
}

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const addAppointment = useStore((s) => s.addAppointment);
  const savedCustomization = useStore((s) => s.customization);

  const fromCustomizer = (location.state as { fromCustomizer?: boolean } | null)?.fromCustomizer === true;

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(() => ({
    services: fromCustomizer ? inferServicesFromDesign(savedCustomization) : [],
    date: '',
    time: '',
    logistics: 'self-drive',
    pickupAddress: '',
    pickupTimePreference: 'morning',
    customerName: '',
    email: '',
    phone: '',
    carModel: '',
    carPlate: '',
    notes: '',
  }));

  const today = new Date();
  const [calMonth, setCalMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const toDateStr = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const isDateDisabled = (dateStr: string) => {
    const d = new Date(dateStr);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart || d.getDay() === 0;
  };

  const isFullyBooked = (dateStr: string) =>
    (BOOKED_SLOTS[dateStr]?.length ?? 0) >= TIME_SLOTS.length;

  const getAvailableCount = (dateStr: string) =>
    TIME_SLOTS.length - (BOOKED_SLOTS[dateStr]?.length ?? 0);

  const toggleService = (id: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter((s) => s !== id) : [...f.services, id],
    }));

  const canProceed = () => {
    switch (step) {
      case 1: return form.services.length > 0;
      case 2: return !!form.date && !!form.time;
      case 3: return form.logistics === 'self-drive' || !!form.pickupAddress.trim();
      case 4: return !!form.customerName.trim() && !!form.email.trim() && !!form.phone.trim() && !!form.carModel.trim() && !!form.carPlate.trim();
      default: return true;
    }
  };

  const handleSubmit = () => {
    const appointment: AppointmentBooking = {
      id: `APT-${Date.now()}`,
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      car: form.carModel,
      carPlate: form.carPlate,
      services: form.services,
      date: form.date,
      timeSlot: form.time,
      logistics: form.logistics,
      pickupAddress: form.pickupAddress || undefined,
      pickupTimePreference: form.logistics !== 'self-drive' ? form.pickupTimePreference : undefined,
      status: 'pending',
      notes: form.notes || undefined,
      savedDesign: fromCustomizer ? savedCustomization : undefined,
      createdAt: new Date().toISOString(),
    };
    addAppointment(appointment);
    setStep(5);
  };

  const prevMonth = () =>
    setCalMonth((cm) => cm.month === 0 ? { year: cm.year - 1, month: 11 } : { ...cm, month: cm.month - 1 });
  const nextMonth = () =>
    setCalMonth((cm) => cm.month === 11 ? { year: cm.year + 1, month: 0 } : { ...cm, month: cm.month + 1 });

  const renderCalendar = () => {
    const { year, month } = calMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-white font-semibold">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-zinc-500 font-medium py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = toDateStr(year, month, day);
            const disabled = isDateDisabled(dateStr);
            const fullyBooked = !disabled && isFullyBooked(dateStr);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === form.date;
            const partiallyBooked = !disabled && !fullyBooked && (BOOKED_SLOTS[dateStr]?.length ?? 0) > 0;

            return (
              <button
                key={i}
                disabled={disabled || fullyBooked}
                onClick={() => setForm((f) => ({ ...f, date: dateStr, time: '' }))}
                className="relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all"
                style={
                  isSelected
                    ? { background: GOLD, color: '#000', fontWeight: 700 }
                    : isToday && !isSelected
                    ? { border: `1.5px solid ${GOLD}`, color: GOLD }
                    : disabled || fullyBooked
                    ? { color: '#3f3f46', cursor: 'not-allowed' }
                    : { color: '#e4e4e7' }
                }
              >
                {day}
                {fullyBooked && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />}
                {partiallyBooked && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-500" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />Partially booked</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Fully booked</div>
        </div>
      </div>
    );
  };

  const inputCls = "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 transition-colors";

  return (
    <div className="min-h-screen bg-zinc-950" style={{ fontFamily: "'Heebo', sans-serif" }}>

      {/* Header */}
      <header className="bg-black border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/customize')} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png" alt="VOS" className="h-8 w-auto" />
          <span className="text-zinc-600">|</span>
          <span className="text-white font-semibold">Book an Appointment</span>
        </div>
      </header>

      {/* Progress stepper */}
      {step < 5 && (
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center">
              {STEP_LABELS.map((label, i) => {
                const s = (i + 1) as Step;
                const active = s === step;
                const done = s < step;
                return (
                  <div key={label} className="flex items-center flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={done || active ? { background: GOLD, color: '#000' } : { background: '#27272a', color: '#71717a' }}
                      >
                        {done ? <Check size={13} /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block truncate ${active ? 'text-white' : done ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2" style={{ background: done ? GOLD : '#27272a' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-4">

        {/* ── STEP 1: Services ── */}
        {step === 1 && (
          <div>
            {fromCustomizer ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-1">Your Services Summary</h2>
                <p className="text-zinc-400 mb-4">These services have been automatically selected based on your 3D customisation.</p>

                {/* Design banner */}
                <div className="mb-5 p-4 rounded-xl border flex items-start gap-4" style={{ borderColor: GOLD, background: 'rgba(246,189,45,0.07)' }}>
                  <div className="w-9 h-9 rounded-full shrink-0 border-2 mt-0.5" style={{ background: savedCustomization.bodyColor, borderColor: GOLD }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm mb-0.5">Design from 3D Customizer</p>
                    <p className="text-zinc-400 text-xs">
                      {savedCustomization.finishType.charAt(0).toUpperCase() + savedCustomization.finishType.slice(1)} finish
                      {savedCustomization.windowTint > 0 ? ` · ${Math.round(savedCustomization.windowTint * 100)}% window tint` : ''}
                      {savedCustomization.selectedMods.length > 0 ? ` · ${savedCustomization.selectedMods.length} mod${savedCustomization.selectedMods.length > 1 ? 's' : ''}` : ''}
                    </p>
                  </div>
                </div>

                {/* Receipt-style service list */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-6">
                  {form.services.map((id, idx) => {
                    const s = SERVICES.find((svc) => svc.id === id);
                    if (!s) return null;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between gap-4 px-5 py-4 ${idx < form.services.length - 1 ? 'border-b border-zinc-800' : ''}`}
                      >
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm">{s.name}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{s.duration}</p>
                        </div>
                        <span className="text-sm font-semibold shrink-0" style={{ color: GOLD }}>{s.price}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <button
                    onClick={() => navigate('/customize')}
                    className="px-6 py-3 font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors text-sm"
                  >
                    Back to Customisation
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 font-semibold text-black transition-colors hover:bg-white"
                    style={{ background: GOLD }}
                  >
                    Continue — Pick a Date &amp; Time
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-1">Select Services</h2>
                <p className="text-zinc-400 mb-3">Choose one or more services. Select all that apply.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {SERVICES.map((s) => {
                    const selected = form.services.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className="relative text-left p-3 rounded-xl border transition-all"
                        style={selected
                          ? { borderColor: GOLD, background: 'rgba(246,189,45,0.08)' }
                          : { borderColor: '#27272a', background: '#18181b' }}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                            <Check size={12} color="#000" />
                          </div>
                        )}
                        <p className="text-white font-semibold mb-0.5">{s.name}</p>
                        <p className="text-zinc-400 text-sm mb-2">{s.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">{s.duration}</span>
                          <span className="text-xs font-semibold" style={{ color: GOLD }}>{s.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={!canProceed()}
                    onClick={() => setStep(2)}
                    className="px-8 py-3 font-semibold text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    style={{ background: GOLD }}
                  >
                    Continue — Pick a Date &amp; Time
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: Date & Time ── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Choose Date &amp; Time</h2>
            <p className="text-zinc-400 mb-6">We're open Monday–Saturday, 9am–6pm. Sundays are closed.</p>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Calendar */}
              <div className="w-full lg:w-auto shrink-0">
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 lg:w-80">
                  {renderCalendar()}
                </div>
                {form.date && (
                  <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: GOLD, background: 'rgba(246,189,45,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} style={{ color: GOLD }} />
                      <span className="text-white font-medium text-xs">
                        {new Date(form.date + 'T00:00:00').toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1">{getAvailableCount(form.date)} time slots available</p>
                  </div>
                )}
              </div>

              {/* Time slots */}
              <div className="flex-1 w-full">
                {form.date ? (
                  <>
                    <h3 className="text-white font-semibold mb-1">Available Time Slots</h3>
                    <p className="text-zinc-500 text-sm mb-4">Each slot is 1 hour. Our team will contact you to confirm scheduling for complex jobs.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map((t) => {
                        const booked = (BOOKED_SLOTS[form.date] || []).includes(t);
                        const selected = form.time === t;
                        return (
                          <button
                            key={t}
                            disabled={booked}
                            onClick={() => setForm((f) => ({ ...f, time: t }))}
                            className="py-3 rounded-lg border text-sm font-medium transition-all"
                            style={
                              selected
                                ? { background: GOLD, borderColor: GOLD, color: '#000', fontWeight: 700 }
                                : booked
                                ? { borderColor: '#27272a', color: '#52525b', cursor: 'not-allowed', background: '#18181b' }
                                : { borderColor: '#3f3f46', color: '#e4e4e7', background: '#27272a' }
                            }
                          >
                            {booked ? <span className="line-through">{formatTime(t)}</span> : formatTime(t)}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-48 text-center rounded-xl border border-zinc-800 bg-zinc-900 p-8">
                    <Clock size={36} className="mb-3" style={{ color: '#3f3f46' }} />
                    <p className="text-zinc-500 text-sm">Select a date on the calendar to see available time slots</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3 font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors text-sm">Back</button>
              <button
                disabled={!canProceed()}
                onClick={() => setStep(3)}
                className="px-8 py-3 font-semibold text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                style={{ background: GOLD }}
              >
                Continue — Logistics
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Logistics ── */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Car Logistics</h2>
            <p className="text-zinc-400 mb-8">How would you like to arrange your car's transport?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Self-drive */}
              <button
                onClick={() => setForm((f) => ({ ...f, logistics: 'self-drive' }))}
                className="text-left p-6 rounded-xl border transition-all"
                style={form.logistics === 'self-drive'
                  ? { borderColor: GOLD, background: 'rgba(246,189,45,0.08)' }
                  : { borderColor: '#27272a', background: '#18181b' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: form.logistics === 'self-drive' ? 'rgba(246,189,45,0.18)' : '#27272a' }}>
                  <Car size={24} style={{ color: GOLD }} />
                </div>
                <h3 className="text-white font-semibold mb-2">Self-Drive</h3>
                <p className="text-zinc-400 text-sm">I'll drive my car to the workshop and collect it when the job is done.</p>
                <p className="text-xs mt-3 text-zinc-500">No extra charge</p>
              </button>

              {/* Pickup & Drop-off */}
              <button
                onClick={() => setForm((f) => ({ ...f, logistics: 'pickup-dropoff' }))}
                className="text-left p-6 rounded-xl border transition-all"
                style={form.logistics === 'pickup-dropoff'
                  ? { borderColor: GOLD, background: 'rgba(246,189,45,0.08)' }
                  : { borderColor: '#27272a', background: '#18181b' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: form.logistics === 'pickup-dropoff' ? 'rgba(246,189,45,0.18)' : '#27272a' }}>
                  <Truck size={24} style={{ color: GOLD }} />
                </div>
                <h3 className="text-white font-semibold mb-2">Pickup & Drop-off</h3>
                <p className="text-zinc-400 text-sm">We collect your car from your location and return it once the job is complete.</p>
                <p className="text-xs mt-3" style={{ color: GOLD }}>Delivery fee applies</p>
              </button>

              {/* Pickup + Rental */}
              <button
                onClick={() => setForm((f) => ({ ...f, logistics: 'pickup-rental' }))}
                className="relative text-left p-6 rounded-xl border transition-all overflow-hidden"
                style={form.logistics === 'pickup-rental'
                  ? { borderColor: GOLD, background: 'rgba(246,189,45,0.08)' }
                  : { borderColor: '#27272a', background: '#18181b' }}
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-black" style={{ background: GOLD }}>
                  Popular
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: form.logistics === 'pickup-rental' ? 'rgba(246,189,45,0.18)' : '#27272a' }}>
                  <RefreshCw size={24} style={{ color: GOLD }} />
                </div>
                <h3 className="text-white font-semibold mb-2">Pickup + Rental Car</h3>
                <p className="text-zinc-400 text-sm">We collect your car and provide a rental vehicle for you to use while yours is with us.</p>
                <p className="text-xs mt-3" style={{ color: GOLD }}>Pickup + rental fees apply</p>
              </button>
            </div>

            {form.logistics !== 'self-drive' && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8 max-w-2xl">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={15} style={{ color: GOLD }} /> Pickup Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Pickup Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Orchard Road, #04-01, Singapore 238839"
                      value={form.pickupAddress}
                      onChange={(e) => setForm((f) => ({ ...f, pickupAddress: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Preferred Pickup Time</label>
                    <div className="flex gap-3">
                      {(['morning', 'afternoon'] as const).map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setForm((f) => ({ ...f, pickupTimePreference: pref }))}
                          className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                          style={form.pickupTimePreference === pref
                            ? { borderColor: GOLD, background: 'rgba(246,189,45,0.1)', color: GOLD }
                            : { borderColor: '#3f3f46', color: '#a1a1aa', background: '#27272a' }}
                        >
                          {pref === 'morning' ? 'Morning (9am–12pm)' : 'Afternoon (12pm–5pm)'}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.logistics === 'pickup-rental' && (
                    <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
                      <p className="text-sm text-zinc-300 flex items-start gap-2">
                        <RefreshCw size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                        A rental car will be delivered to your pickup address when we collect your vehicle. Our team will confirm rental availability after booking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-3 font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors text-sm">Back</button>
              <button
                disabled={!canProceed()}
                onClick={() => setStep(4)}
                className="px-8 py-3 font-semibold text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                style={{ background: GOLD }}
              >
                Continue — Your Details
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Customer Details ── */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
            <p className="text-zinc-400 mb-8">Almost done — fill in your contact and vehicle info.</p>

            <div className="max-w-2xl space-y-5 mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2"><User size={13} /> Full Name *</label>
                  <input type="text" placeholder="John Doe" value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2"><Phone size={13} /> Phone Number *</label>
                  <input type="tel" placeholder="+65 9123 4567" value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2"><Mail size={13} /> Email Address *</label>
                <input type="email" placeholder="john@example.com" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2"><Car size={13} /> Car Make & Model *</label>
                  <input type="text" placeholder="e.g. Toyota Supra MK5" value={form.carModel}
                    onChange={(e) => setForm((f) => ({ ...f, carModel: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2"><FileText size={13} /> Car Plate Number *</label>
                  <input type="text" placeholder="e.g. SGB 1234 A" value={form.carPlate}
                    onChange={(e) => setForm((f) => ({ ...f, carPlate: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                  <FileText size={13} /> Additional Notes <span className="text-zinc-600">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requests, colour preferences, or details we should know..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Summary */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <h4 className="text-white font-semibold mb-3 text-sm">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500 shrink-0">Services</span>
                    <span className="text-white text-right">{form.services.map((id) => SERVICES.find((s) => s.id === id)?.name).join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Date</span>
                    <span className="text-white">{new Date(form.date + 'T00:00:00').toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Time</span>
                    <span className="text-white">{formatTime(form.time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Logistics</span>
                    <span className="text-white">
                      {form.logistics === 'self-drive' ? 'Self-Drive' : form.logistics === 'pickup-dropoff' ? 'Pickup & Drop-off' : 'Pickup + Rental Car'}
                    </span>
                  </div>
                  {form.pickupAddress && (
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 shrink-0">Pickup</span>
                      <span className="text-white text-right">{form.pickupAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="px-6 py-3 font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors text-sm">Back</button>
              <button
                disabled={!canProceed()}
                onClick={handleSubmit}
                className="px-8 py-3 font-semibold text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                style={{ background: GOLD }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Confirmation ── */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(246,189,45,0.12)', border: `2px solid ${GOLD}` }}>
              <CheckCircle size={40} style={{ color: GOLD }} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
            <p className="text-zinc-400 mb-8 max-w-md">
              Thank you, <span className="text-white font-medium">{form.customerName}</span>! Your appointment has been submitted.
              Our team will contact you at <span className="text-white">{form.phone}</span> within 24 hours to confirm the details.
            </p>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-left w-full max-w-md mb-8">
              <h4 className="text-white font-semibold mb-4">Appointment Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar size={15} style={{ color: GOLD }} />
                  <span className="text-white">{new Date(form.date + 'T00:00:00').toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={15} style={{ color: GOLD }} />
                  <span className="text-white">{formatTime(form.time)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car size={15} style={{ color: GOLD }} />
                  <span className="text-white">{form.carModel} ({form.carPlate})</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={15} style={{ color: GOLD }} />
                  <span className="text-white">{form.services.map((id) => SERVICES.find((s) => s.id === id)?.name).join(', ')}</span>
                </div>
                {form.logistics !== 'self-drive' && (
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                    <span className="text-white">
                      {form.logistics === 'pickup-dropoff' ? 'Pickup & Drop-off' : 'Pickup + Rental Car'} — {form.pickupAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/')} className="px-6 py-3 font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors text-sm">
                Back to Home
              </button>
              <button
                onClick={() => navigate('/customize')}
                className="px-8 py-3 font-semibold text-black transition-colors hover:bg-white"
                style={{ background: GOLD }}
              >
                Try 3D Customizer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
