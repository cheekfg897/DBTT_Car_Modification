import { CarScene } from '../components/three/CarScene';
import { CustomizerPanel } from '../components/customizer/CustomizerPanel';
import { AIChatbot } from '../components/customizer/AIChatbot';

export function CustomerPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1">
        <CarScene />
      </div>
      <CustomizerPanel />
      <AIChatbot />
    </div>
  );
}
