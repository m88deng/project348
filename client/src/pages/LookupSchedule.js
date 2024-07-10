import { useState } from "react";
import { StyledLookupSchedule } from "../styles/LookupSchedule.styled";

export default function LookupSchedule() {
    const [route, setRoute] = useState('');
    const [Direction, setDirection] = useState('');
    const [wheelchair, setWheelchair] = useState(0);

    const handleScheduleSearch = async (e) => {
        e.preventDefault();
        console.log("searching schedules...");
    }
    return (
        <StyledLookupSchedule className="container">
            <form>
                <div><label>Route</label></div>
                <div><input type="text" value={route} onChange={(e) => setRoute(e.target.value)} required /></div>
                <div><label>Direction</label></div>
                <div><input type="text" value={Direction} onChange={(e) => setDirection(e.target.value)} /></div>
                <div><input type="checkbox" /><label>Wheelchair boarding available</label></div>
                <div><button type="submit" onClick={handleScheduleSearch}>Search</button></div>
            </form>
        </StyledLookupSchedule>
    );
}