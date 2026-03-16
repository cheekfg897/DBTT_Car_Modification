import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CustomizerApp } from './pages/CustomizerApp';
import { BookingPage } from './pages/BookingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/customize" element={<CustomizerApp />} />
      <Route path="/book" element={<BookingPage />} />
    </Routes>
  );
}

export default App;
