import { useStore } from '../../store/useStore';
import { JobCard } from './JobCard';
import { Calendar } from 'lucide-react';

export function JobList() {
  const bookings = useStore((s) => s.bookings);
  const todayJobs = bookings.filter((b) => b.date === '2026-03-11');

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-orange-accent" />
        <h2 className="text-lg font-bold text-white">Today's Jobs</h2>
        <span className="ml-auto px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
          {todayJobs.length} jobs
        </span>
      </div>
      {todayJobs.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-8">No jobs scheduled for today</p>
      ) : (
        <div className="space-y-3">
          {todayJobs.map((b) => (
            <JobCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
