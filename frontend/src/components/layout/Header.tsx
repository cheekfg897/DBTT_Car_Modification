import { Wrench } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-accent rounded-lg flex items-center justify-center">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Los Santos Customs</h1>
          <p className="text-xs text-zinc-500">Car Modification Workshop</p>
        </div>
      </div>
      <RoleSwitcher />
    </header>
  );
}
