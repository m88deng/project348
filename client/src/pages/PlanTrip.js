import { useState } from "react";

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');

    const handleRouteSearch = async (e) => {
        console.log("leavingday " + leavingDay);
        console.log("from point " + fromPoint);
        console.log("to point" + toPoint);

        e.preventDefault();
        console.log("searching routes...");
    }

    const handleDateChange = (e) => {
        const rawDate = e.target.value; // e.g., "2024-07-23"
        const formattedDate = rawDate.replace(/-/g, ''); // e.g., "20240723"
        setLeavingDay(formattedDate);
    };

    return (
        <form id="tripForm" className="container py-3">
            <div className="py-2"><label>Leaving Day</label></div>
            <div className="pb-3">
                <input type="date" value={leavingDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
                    onChange={handleDateChange} />
            </div>
            <div className="py-2"><label>From</label></div>
            <div><input type="text" value={fromPoint} placeholder="station/stop" onChange={(e) => setFromPoint(e.target.value)} required /></div>
            <div className="py-2"><label>To</label></div>
            <div className="pb-3"><input type="text" value={toPoint} placeholder="station/stop" onChange={(e) => setToPoint(e.target.value)} required /></div>
            <div><button type="submit" onClick={handleRouteSearch}>Search</button></div>
        </form>
    );
}