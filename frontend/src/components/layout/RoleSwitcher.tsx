import { User, HardHat, BarChart3 } from 'lucide-react';
import { useStore, type Role } from '../../store/useStore';

const roles: { key: Role; label: string; icon: typeof User }[] = [
  { key: 'customer', label: 'Customer', icon: User },
  { key: 'worker', label: 'Worker', icon: HardHat },
  { key: 'owner', label: 'Owner', icon: BarChart3 },
];

export function RoleSwitcher() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);

  return (
    <div className="flex bg-zinc-800 rounded-lg p-1 gap-1">
      {roles.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setRole(key)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            role === key
              ? 'bg-orange-accent text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
