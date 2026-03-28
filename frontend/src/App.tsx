import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CustomizerApp } from './pages/CustomizerApp';
import { BookingPage } from './pages/BookingPage';
import { TrackingPage } from './pages/TrackingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/customize" element={<CustomizerApp />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/track" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;
