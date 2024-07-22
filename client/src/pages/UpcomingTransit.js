import { useState } from "react";
import { StyledUpcomingTransit } from "../styles/UpcomingTransit.styled";
import './UpcomingTransit.css';

export default function UpcomingTransit() {
    const [stop, setStop] = useState('');

    const handleUpcomingTransitSearch = async (e) => {
        console.log("searching upcoming transit...");
    }

    return (
        <StyledUpcomingTransit className="container">
            <form>
                <div className="center">
                    <div className="align">
                        <div className="Title"><label>Current Stop</label></div>
                        <div><input type="text" className="stop"placeholder="3 - Ottawa South" value={stop} onChange={(e) => setStop(e.target.value)} required /></div>
                    </div>
                    <div style={{color:"transparent"}}><button className="submit" type="submit" onClick={handleUpcomingTransitSearch}>Search</button></div>
                </div>
            </form>
        </StyledUpcomingTransit>
    );
}
