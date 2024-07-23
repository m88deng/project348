import { useState, useEffect } from "react";
import {
    Container,
    FormControl,
    FormGroup,
    Label,
    PlanTripForm,
    SearchButton
} from "../styles/PlanTrip.styled";
import Select from 'react-select';

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');
    const [stopNames, setStopNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const response = await fetch('http://localhost:5290/3');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const formattedData = data.map(item => ({
                    label: item.stop_name,
                    value: item.stop_name
                }));

                setStopNames(formattedData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchNames();
    }, []);

    if (loading) return "Loading";
    if (error) return <pre>{error.message}</pre>;

    const handleFromPointChange = selectedOption => {
        setFromPoint(selectedOption ? selectedOption.value : '');
    };

    const handleToPointChange = selectedOption => {
        setToPoint(selectedOption ? selectedOption.value : '');
    };


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

                        const resText = await res.text();
                        if (resText) {
                            const data = JSON.parse(resText);
                            console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);
                            dataFound = true;
                            break;
                        } else {
                            console.log("No data found. The response is empty.");
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
        <Container>
            <PlanTripForm onSubmit={handleRouteSearch}>
                <FormGroup>
                    <Label htmlFor="leave-time">LEAVE TIME</Label>
                    <FormControl
                        type="date"
                        id="leave-time"
                        value={leavingDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
                        onChange={handleDateChange}
                        placeholder="YY / MM / DD"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="from-point">FROM</Label>
                    <Select id="from-point" options={stopNames} placeholder={"From Station/Stop"} onChange={handleFromPointChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="to-point">TO</Label>
                    <Select id="to-point" options={stopNames} placeholder={"To Station/Stop"} onChange={handleToPointChange} />
                </FormGroup>
                <FormGroup>
                    <SearchButton type="submit" onClick={handleRouteSearch}>Search</SearchButton>
                </FormGroup>
            </PlanTripForm>
        </Container>
    );
}
