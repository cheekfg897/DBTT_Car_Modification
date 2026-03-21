import { IncomingBookings } from '../components/worker/IncomingBookings';

export function WorkerPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "'Russo One', sans-serif" }}>Worker Dashboard</h1>
      <IncomingBookings />
    </div>
  );
}
