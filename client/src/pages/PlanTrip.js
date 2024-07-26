import { useState, useEffect } from "react";
import {
    Container,
    FormControl,
    FormGroup,
    Label,
    PlanTripForm,
    SearchButton,
    PlantripContainer,
    PlantripRow
} from "../styles/PlanTrip.styled";
import Select from 'react-select';

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');
    const [stopNames, setStopNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [planTripResults, setPlanTripResults] = useState([]);
    const [loadingText, setLoadingText] = useState('');

    //names
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

    //loading
    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setLoadingText((prev) => {
                    if (prev.length < 3) {
                        return prev + '.';
                    }
                    return '';
                });
            }, 500);
        } else {
            setLoadingText('');
            if (interval) {
                clearInterval(interval);
            }
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [loading]);

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
        setLoading(true);
        try {
            const { startData, endData } = await handleIdSearch();
            let datafound = false;
            for (let i = 0; i < startData.length && !datafound; i++) {
                for (let j = 0; j < endData.length; j++) {
                    try {
                        const url = `http://localhost:5290/6/${startData[i].stop_id}/${endData[j].stop_id}/${leavingDay}/${getCurrentTime()}`;
                        const res = await fetch(url, { method: "GET" });
                        if (!res.ok) {
                            console.warn(`HTTP error! status: ${res.status} for URL: ${url}`);
                            continue;
                        }
                        const resText = await res.text();
                        if (resText) {
                            const data = JSON.parse(resText);
                            console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);
                            datafound = true;
                            setPlanTripResults(data);
                            break;
                        } else {
                            console.log("No direct trip found. The response is empty.");
                        }
                    } catch (error) {
                        console.error(`Error fetching direct trip data for ${startData[i]} to ${endData[j]}: `, error);
                    }
                }

                if (datafound) {
                    break;
                }
            }

            let tripOptions = [];
            if (!datafound) {
                for (let i = 0; i < startData.length && !datafound; i++) {
                    for (let j = 0; j < endData.length; j++) {
                        try {
                            const url = `http://localhost:5290/5/${startData[i].stop_id}/${endData[j].stop_id}/${leavingDay}/${getCurrentTime()}`;
                            const res = await fetch(url, { method: "GET" });
                            if (!res.ok) {
                                console.warn(`HTTP error! status: ${res.status} for URL: ${url}`);
                                continue;
                            }
                            const resText = await res.text();
                            if (resText) {
                                const data = JSON.parse(resText);
                                console.log(`Fetched data for ${startData[i]} to ${endData[j]}:`, data);
                                datafound = true;
                                tripOptions.push(data);
                            } else {
                                console.log("No direct trip found. The response is empty.");
                            }
                        } catch (error) {
                            console.error(`Error fetching direct trip data for ${startData[i]} to ${endData[j]}: `, error);
                        }
                    }
                }
            }
            if (tripOptions.length > 0) {
                // Find the trip option with the smallest size
                const smallestTrip = tripOptions.reduce((smallest, current) =>
                    current.length < smallest.length ? current : smallest
                );

                setPlanTripResults(smallestTrip);
            } else {
                console.log("No data found for any combination of start and end points.");
            }
            if (!datafound) {
                console.log("No data found for any combination of start and end points.");
            }
        } catch (error) {
            console.error("Error in handleRouteSearch: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        const rawDate = e.target.value;
        const formattedDate = rawDate.replace(/-/g, '');
        setLeavingDay(formattedDate);
    };

    return (
        <>
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
            <PlantripContainer>
                {loading ? (
                    <div>Loading{loadingText}</div>
                ) : (planTripResults.map((t) => (
                        <PlantripRow key={`${t.stop_id}-${t.stop_sequence}`} className="row">
                            <div className="py-2">{`${t.route_id} - ${t.trip_headsign} Stop: ${t.stop_name} Arrival Time: ${t.arrival_time}`}</div>
                        </PlantripRow>
                    ))
                )}
            </PlantripContainer>
            
        </>
    );
}