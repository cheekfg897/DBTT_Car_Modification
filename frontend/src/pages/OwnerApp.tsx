import { StaffHeader } from '../components/layout/StaffHeader';
import { OwnerPage } from './OwnerPage';

export function OwnerApp() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      <StaffHeader title="Owner Dashboard" />
      <OwnerPage />
    </div>
  );
}
