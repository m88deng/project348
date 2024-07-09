import './styles/App.css';
import PlanTrip from './pages/PlanTrip';
import PlanTripResult from './pages/PlanTripResult';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlanTrip />} />
        <Route path="/plan-trip-results" element={<PlanTripResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
