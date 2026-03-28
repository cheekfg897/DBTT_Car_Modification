import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
}

export function StaffHeader({ title }: Props) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-zinc-950 border-b border-zinc-800 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/staff')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Staff Portal
        </button>
        <div className="w-px h-6 bg-zinc-800" />
        <div className="flex items-center gap-2.5">
          <img
            src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png"
            alt="VOS Automotive"
            className="h-8 w-auto"
          />
          <p className="text-xs text-zinc-500 leading-none">{title}</p>
        </div>
      </div>
    </header>
  );
}
