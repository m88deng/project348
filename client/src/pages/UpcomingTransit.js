import { useState } from "react";
import { StyledUpcomingTransit } from "../styles/UpcomingTransit.styled";

export default function UpcomingTransit() {
    const [stop, setStop] = useState('');

    const handleUpcomingTransitSearch = async (e) => {
        console.log("searching upcoming transit...");
    }

    return (
        <StyledUpcomingTransit className="container">
            <form>
                <div><label>Current Stop</label></div>
                <div><input type="text" value={stop} onChange={(e) => setStop(e.target.value)} required /></div>
                <div><button type="submit" onClick={handleUpcomingTransitSearch}>Search</button></div>
            </form>
        </StyledUpcomingTransit>
    );
}