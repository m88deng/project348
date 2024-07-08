import { useState } from "react";

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');

    const handleRouteSearch = async (e) => {
        e.preventDefault();
        console.log("searching routes...");
    }
    return (
        <form>
            <div><label>Leaving Day</label></div>
            <div><input type="date" value={leavingDay} onChange={(e) => setLeavingDay(e.target.value)} /></div>
            <div className="py-2"><label>From</label></div>
            <div><input type="text" value={fromPoint} placeholder="station/stop" onChange={(e) => setFromPoint(e.target.value)} /></div>
            <div className="py-2"><label>To</label></div>
            <div><input type="text" value={toPoint} placeholder="station/stop" onChange={(e) => setToPoint(e.target.value)} /></div>
            <div><button type="submit" onClick={handleRouteSearch}>Search</button></div>
        </form>
    );
}