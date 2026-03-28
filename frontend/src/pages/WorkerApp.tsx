import { StaffHeader } from '../components/layout/StaffHeader';
import { WorkerPage } from './WorkerPage';

export function WorkerApp() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      <StaffHeader title="Worker Dashboard" />
      <WorkerPage />
    </div>
  );
}
