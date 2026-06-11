import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Agents from '@/pages/Agents';
import Simulation from '@/pages/Simulation';
import Prediction from '@/pages/Prediction';
import NILM from '@/pages/NILM';
import Comparison from '@/pages/Comparison';
import Settings from '@/pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/nilm" element={<NILM />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;