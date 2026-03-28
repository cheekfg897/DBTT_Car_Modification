import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CustomizerApp } from './pages/CustomizerApp';
import { BookingPage } from './pages/BookingPage';
import { TrackingPage } from './pages/TrackingPage';
import { StaffPortalPage } from './pages/StaffPortalPage';
import { WorkerApp } from './pages/WorkerApp';
import { OwnerApp } from './pages/OwnerApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/customize" element={<CustomizerApp />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/track" element={<TrackingPage />} />
      <Route path="/staff" element={<StaffPortalPage />} />
      <Route path="/worker" element={<WorkerApp />} />
      <Route path="/owner" element={<OwnerApp />} />
    </Routes>
  );
}

export default App;
