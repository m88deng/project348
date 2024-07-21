import { useState } from "react";
import { StyledLookupSchedule } from "../styles/LookupSchedule.styled";

export default function LookupSchedule() {
    const [route, setRoute] = useState('');
    const [direction, setDirection] = useState('');
    const [wheelchair, setWheelchair] = useState(false);

    const url = `http://localhost:5290/3`;

    const handleScheduleSearch = async (e) => {
        e.preventDefault();
        console.log("Route " + route);
        console.log("direction " + direction);
        console.log("wheelchair " + wheelchair);
        const res = await fetch(url, { method: "GET" })
        console.log(res.json());
    }
    return (
        <StyledLookupSchedule className="container">
            <form id="scheduleForm">
                <div><label>Route</label></div>
                <div><input type="text" value={route} onChange={(e) => setRoute(e.target.value)} required /></div>
                <div><label>Direction</label></div>
                <div><input type="text" value={direction} onChange={(e) => setDirection(e.target.value)} /></div>
                <div>
                    <input type="checkbox" checked={wheelchair} onChange={(e) => setWheelchair(e.target.checked)} />
                    <label>Wheelchair boarding available</label>
                </div>
                <div><button type="submit" onClick={handleScheduleSearch}>Search</button></div>
            </form>
        </StyledLookupSchedule>
    );
}

