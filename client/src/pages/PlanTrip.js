import { useState } from "react";

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');

    const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    const encodeSlash = (input) => {
        return input.replace(/\//g, '%2F');
    };

    const handleIdSearch = async () => {


        const startURL = `http://localhost:5290/9/${encodeSlash(fromPoint)}`;
        const endURL = `http://localhost:5290/9/${encodeSlash(toPoint)}`;

        let startData = [], endData = [];

        try {
            const res = await fetch(startURL, { method: "GET" });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            startData = await res.json();
            console.log("Fetched Starting ID data:", startData);
        } catch (error) {
            console.error("Error fetching start ID data: ", error);
        }
        try {
            const res = await fetch(endURL, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            endData = await res.json();
            console.log("Fetched Ending ID data:", endData);
        } catch (error) {
            console.error("Error fetching end ID data: ", error);
        }
        return { startData, endData };
    };

    const handleRouteSearch = async (e) => {
        e.preventDefault();

        try {
            const { startData, endData } = await handleIdSearch();

            let dataFound = false;

            for (let i = 0; i < startData.length && !dataFound; i++) {
                for (let j = 0; j < endData.length; j++) {

                    const url = `http://localhost:5290/6/${startData[i].stop_id}/${endData[j].stop_id}/${leavingDay}/${getCurrentTime()}`;

                    try {
                        const res = await fetch(url, { method: "GET" });

                        if (!res.ok) {
                            console.warn(`HTTP error! status: ${res.status} for URL: ${url}`);
                            continue;
                        }

                        const data = await res.json();

                        if (Array.isArray(data) && data.length === 0) {
                            console.log(`No data found for ${startData[i]} to ${endData[j]}`);
                        } else if (data) {
                            console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);
                            dataFound = true;
                            break;
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${startData[i]} to ${endData[j]}: `, error);
                    }
                }

                if (dataFound) {
                    break;
                }
            }

            if (!dataFound) {
                console.log("No data found for any combination of start and end points.");
            }
        } catch (error) {
            console.error("Error in handleRouteSearch: ", error);
        }
    };

    const handleDateChange = (e) => {
        const rawDate = e.target.value;
        const formattedDate = rawDate.replace(/-/g, '');
        setLeavingDay(formattedDate);
    };

    return (
        <form className="container py-3">
            <div className="py-2"><label>Leaving Day</label></div>
            <div className="pb-3">
                <input
                    type="date"
                    value={leavingDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
                    onChange={handleDateChange}
                />
            </div>
            <div className="py-2"><label>From</label></div>
            <div><input type="text" value={fromPoint} placeholder="station/stop" onChange={(e) => setFromPoint(e.target.value)} required /></div>
            <div className="py-2"><label>To</label></div>
            <div className="pb-3">
                <input type="text" value={toPoint} placeholder="station/stop" onChange={(e) => setToPoint(e.target.value)} required /></div>
            <div><button type="submit" onClick={handleRouteSearch}>Search</button></div>
        </form>
    );
}