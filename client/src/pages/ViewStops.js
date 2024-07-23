import { useState } from "react";
import { StyledViewStops } from "../styles/ViewStops.styled";
export default function UpcomingTransit() {
    const [stop, setStop] = useState('');

    const queryAllStops = async (e) => {
        console.log("searching upcoming transit...");
    }

    return (
        <StyledViewStops className="container">

        </StyledViewStops>
    );
}