import { useState } from "react";

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');

    const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    const handleIdSearch = async (e) => {
        const startURL = `http://localhost:5290/9/${fromPoint}`;
        const endURL = `http://localhost:5290/9/${toPoint}`;

        console.log(startURL);
        console.log(endURL);

        let startData = [], endData = [];

        try {
            const res = await fetch(startURL, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            startData = await res.json();
            console.log("Fetched Starting ID data:", startData);
        } catch (error) {
            console.error("Error fetching starting ID data: ", error);
        }

        try {
            const res = await fetch(endURL, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            endData = await res.json();
            console.log("Fetched Ending ID data:", endData);
        } catch (error) {
            console.error("Error fetching ending ID data: ", error);
        }
        return { startData, endData };
    }

    const handleRouteSearch = async (e) => {
        e.preventDefault();

        try {
            // Call handleIdSearch and wait for it to complete
            const { startData, endData } = await handleIdSearch();
            let dataFound = false;
            for (let i = 0; i < startData.length; i++) {
                for (let j = 0; j < endData.length; j++) {
                    const url = `https://your-api-endpoint/${startData[i]}/${endData[j]}/${leavingDay}/${getCurrentTime()}`;

                    try {
                        // Fetch data from the generated URL
                        const res = await fetch(url, { method: "GET" });

                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }

                        const data = await res.json();

                        if (Array.isArray(data) && data.length === 0) {
                            console.log(`No data found for ${startData[i]} to ${endData[j]}`);
                        } else {
                            console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);

                            dataFound = true;

                            // Break out of the inner loop
                            break;
                        }

                        console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);
                    } catch (error) {
                        console.error(`Error fetching data for ${startData[i]} to ${endData[j]}: `, error);
                    }
                } if (dataFound) {
                    break;
                }
            }
        } catch (error) {
            console.error("Error in handleRouteSearch: ", error);
        }
    }

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
            <div className="pb-3"><input type="text" value={toPoint} placeholder="station/stop" onChange={(e) => setToPoint(e.target.value)} required /></div>
            <div><button type="submit" onClick={handleRouteSearch}>Search</button></div>
        </form>
    );
}