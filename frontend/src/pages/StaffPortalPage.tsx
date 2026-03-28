import { useNavigate } from 'react-router-dom';
import { HardHat, BarChart3, ArrowLeft } from 'lucide-react';

const GOLD = '#f6bd2d';

const ROLES = [
  {
    key: 'worker',
    label: 'Worker',
    description: 'View and manage incoming jobs, update booking statuses, and track the workshop queue.',
    icon: HardHat,
    route: '/worker',
    color: '#f97316',
  },
  {
    key: 'owner',
    label: 'Owner',
    description: 'Full business analytics dashboard — revenue, projections, service trends, and inventory.',
    icon: BarChart3,
    route: '/owner',
    color: GOLD,
  },
];

export function StaffPortalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-zinc-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="w-px h-6 bg-zinc-800" />
        <img
          src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png"
          alt="VOS Automotive"
          className="h-8 w-auto"
        />
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">
          Staff Access
        </p>
        <h1
          className="text-white text-3xl font-normal mb-2 text-center"
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          Select Your Role
        </h1>
        <p className="text-zinc-500 text-sm mb-12 text-center">
          Choose your role to access the relevant dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
          {ROLES.map(({ key, label, description, icon: Icon, route, color }) => (
            <button
              key={key}
              onClick={() => navigate(route)}
              className="group text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 transition-all hover:bg-zinc-800/80"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${color}18`, border: `1px solid ${color}40` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <p className="text-white font-bold text-lg mb-2">{label}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
              <p
                className="text-sm font-semibold mt-4 flex items-center gap-1 transition-colors"
                style={{ color }}
              >
                Enter Dashboard →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
