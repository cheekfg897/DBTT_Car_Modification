import { Header } from '../components/layout/Header';
import { CustomerPage } from './CustomerPage';

export function CustomizerApp() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <Header />
      <CustomerPage />
    </div>
  );
}