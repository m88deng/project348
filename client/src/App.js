import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlanTrip from './pages/PlanTrip';
import PlanTripResult from './pages/PlanTripResult';
import Header from './components/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LookupSchedule from './pages/LookupSchedule';
import UpcomingTransit from './pages/UpcomingTransit';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<PlanTrip />} />
        <Route path="/plan-trip-results" element={<PlanTripResult />} />
        <Route path="/lookup-schedule" element={<LookupSchedule />} />
        <Route path="/upcoming-transit" element={<UpcomingTransit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
