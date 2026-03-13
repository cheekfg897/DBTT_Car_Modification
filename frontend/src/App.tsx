import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CustomizerApp } from './pages/CustomizerApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/customize" element={<CustomizerApp />} />
    </Routes>
  );
}

export default App;
