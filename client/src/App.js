import './styles/App.css';
//import './styles/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import PlanTrip from './pages/PlanTrip';
import Header from './components/header';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LookupSchedule from './pages/LookupSchedule';
import UpcomingTransit from './pages/UpcomingTransit';
import MyAccount from './pages/MyAccount'; 
import Login from './pages/Login';
import RouteStops from './pages/RouteStops'; // Import RouteStops
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  const [canLogin, setCanLogin] = useState(true);
  const [login, setLogin] = useState(true);

  return (
    <AuthProvider>
    <BrowserRouter>
      
    
      <Header canLogin={canLogin} />
      <Routes>
        <Route path="/" element={<PlanTrip />} />
        <Route path="/lookup-schedule" element={<LookupSchedule />} />
        <Route path="/upcoming-transit" element={<UpcomingTransit />} />
        <Route path="/my-account" element={<MyAccount/>} />
        <Route path="/route-stops" element={<RouteStops />} />
        <Route path="/login" element={<Login canLogin={setCanLogin} login={setLogin}/>} />
        <Route path="/signup" element={<Signup canLogin={setCanLogin} login={login}/>} />


      </Routes>
      
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
