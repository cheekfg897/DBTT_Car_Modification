import { Header } from './components/layout/Header';
import { useStore } from './store/useStore';
import { CustomerPage } from './pages/CustomerPage';
import { WorkerPage } from './pages/WorkerPage';
import { OwnerPage } from './pages/OwnerPage';

function App() {
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

export default App;
