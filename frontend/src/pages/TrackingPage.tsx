import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BookingStatusCard } from '../components/customer/BookingStatusCard';
import type { AppointmentBooking } from '../types/booking';

export function TrackingPage() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const appointments   = useStore((s) => s.appointments);
  const [query,    setQuery]    = useState(searchParams.get('id') ?? '');
  const [searched, setSearched] = useState(false);
  const [result,   setResult]   = useState<AppointmentBooking | null>(null);

  // Auto-search if arriving from booking confirmation with ?id=
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const found = appointments.find((a) => a.id.toLowerCase() === id.toLowerCase()) ?? null;
      setResult(found);
      setSearched(true);
    }
  }, []);

  function handleSearch() {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = appointments.find(
      (a) => a.id.toLowerCase() === q || a.email.toLowerCase() === q
    ) ?? null;
    setResult(found);
    setSearched(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 bg-zinc-950 border-b border-zinc-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="w-px h-6 bg-zinc-800" />
        <div className="flex items-center gap-2.5">
          <img
            src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png"
            alt="VOS Automotive"
            className="h-8 w-auto"
          />
          <p className="text-xs text-zinc-500 leading-none">Track My Booking</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-14">
        <div className="w-full max-w-lg">

          <h1 className="text-2xl font-bold text-white mb-2">Track Your Booking</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Enter your booking reference (e.g. <span className="text-zinc-300">APT-001</span>) or
            the email address used when booking.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="APT-001 or your email address"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Search size={15} />
              Search
            </button>
          </div>

          {/* Not found */}
          {searched && !result && (
            <div className="text-center py-12 border border-zinc-800 rounded-xl">
              <p className="text-zinc-300 text-base font-medium">No booking found</p>
              <p className="text-zinc-500 text-sm mt-1">
                Double-check your booking reference or email and try again.
              </p>
            </div>
          )}

          {/* Result */}
          {result && <BookingStatusCard appointment={result} />}

        </div>
      </div>
    </div>
  );
}
