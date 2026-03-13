import { Header } from '../components/layout/Header';
import { useStore } from '../store/useStore';
import { CustomerPage } from './CustomerPage';
import { WorkerPage } from './WorkerPage';
import { OwnerPage } from './OwnerPage';

export function CustomizerApp() {
  const role = useStore((s) => s.role);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <Header />
      {role === 'customer' && <CustomerPage />}
      {role === 'worker' && <WorkerPage />}
      {role === 'owner' && <OwnerPage />}
    </div>
  );
}