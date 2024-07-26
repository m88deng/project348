import React from 'react';
import { useState, useEffect } from "react";
import {
    Container, 
    LookupScheduleForm, 
    FormGroup, 
    Label, 
    CheckboxLabel, 
    Checkbox, 
    SearchButton, 
    TransitContainer, 
    TransitRow, 
    TransitCell 
} from '../styles/LookupSchedule.styled.js';
import Select from 'react-select';

export default function LookupSchedule() {
    const [route, setRoute] = useState('');
    const [direction, setDirection] = useState('');
    const [wheelchair, setWheelchair] = useState(0);
    const [routeNames, setRouteNames] = useState([]);
    const [headsignNames, setHeadsignNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stopsResults, setStopsResults] = useState([]);
    const [scheduleResults, setScheduleResults] = useState([]);
    const [loadingText, setLoadingText] = useState('');

    const getCurrentDate = () => {
        const date = new Date();
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    };

    const encodeSlash = (input) => {
        return input.replace(/\//g, '%2F');
    };

    // routes
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch('http://localhost:5290/10');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const formattedData = data.map(route => ({
                    label: `${route.route_id} ${route.route_long_name}`,
                    value: route.route_id
                }));

                setRouteNames(formattedData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    // headsign
    useEffect(() => {
        const fetchHeadsign = async () => {
            try {
                const response = await fetch(`http://localhost:5290/2/${route}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const resText = await response.text();
                if (resText) {
                    const data = JSON.parse(resText);
                    console.log("Fetched data:", data);

                    const formattedData = data.map(route => ({
                        label: route.trip_headsign,
                        value: route.trip_headsign
                    }));

                    setHeadsignNames(formattedData);
                    setLoading(false);
                } else {
                    console.log("No data found. The response is empty.");
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }

        };

        if (route !== '') { fetchHeadsign(); }
    }, [route]);

    // schedule
    useEffect(() => {
        const fetchDataForStops = async () => {
            setLoading(true);
            setError(null);
            const results = {};

            try {
                // Fetch data for each stop
                for (const stop of stopsResults) {
                    const response = await fetch(`http://localhost:5290/11/${stop.stop_id}/${route}/${encodeSlash(direction)}/${getCurrentDate()}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const resText = await response.text();
                    if (resText) {
                        const data = JSON.parse(resText);
                        results[stop.stop_sequence] = data;
                    } else {
                        console.log("No data found. The response is empty.");
                    }
                }
                setScheduleResults(Object.keys(results).length > 0 ? results : {});
                console.log(scheduleResults);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (stopsResults.length > 0) {
            fetchDataForStops();
        }
    }, [stopsResults]);

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

    const handleRouteChange = selectedOption => {
        setRoute(selectedOption ? selectedOption.value : '');
    };

    const handleHeadsignChange = selectedOption => {
        setDirection(selectedOption ? selectedOption.value : '');
    };

    var url = `http://localhost:5290/7/${route}/${encodeSlash(direction)}`;
    const handleScheduleSearch = async (e) => {
        e.preventDefault();
        if (wheelchair) {
            url = `http://localhost:5290/8/${route}/${direction}`;
        }

        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resText = await res.text();
            if (resText) {
                const data = JSON.parse(resText);
                console.log("Fetched data:", data);
                setStopsResults(data);
                setLoading(false);
            } else {
                console.log("No data found. The response is empty.");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    return (
        <>
            <Container>
                <LookupScheduleForm onSubmit={handleScheduleSearch}>
                    <FormGroup>
                        <Label htmlFor="route">Route</Label>
                        <Select id="route" options={routeNames} value={routeNames.find(option => option.value === route)} placeholder={"Select"} onChange={handleRouteChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="direction">Direction</Label>
                        <Select id="direction" options={headsignNames} value={headsignNames.find(option => option.value === direction)} placeholder={"Select"} onChange={handleHeadsignChange} />
                    </FormGroup>
                    <FormGroup>
                        <CheckboxLabel>
                            <Checkbox
                                type="checkbox"
                                checked={wheelchair}
                                onChange={(e) => setWheelchair(e.target.checked)}
                            />
                            Wheelchair boarding available
                        </CheckboxLabel>
                    </FormGroup>
                    <FormGroup>
                        <SearchButton type="submit" onClick={handleScheduleSearch}>Lookup</SearchButton>
                    </FormGroup>
                </LookupScheduleForm>
            </Container>
            <TransitContainer>
                {loading ? (
                    <div>Loading{loadingText}</div>
                ) : (stopsResults.map((s, index) => (
                    <TransitRow key={s.stop_sequence} index={index}>
                        <TransitCell className="col">{s.stop_name}</TransitCell>
                        <TransitCell className="col d-flex flex-row">
                            {scheduleResults[s.stop_sequence] ? (
                                scheduleResults[s.stop_sequence].map((item, index) => (
                                    <div key={index} className="px-2">{item.arrival_time}</div>
                                ))
                            ) : (
                                <p>No scheduled arrival time at stop #{s.stop_id}</p>
                            )}
                        </TransitCell>
                    </TransitRow>
                )))}
            </TransitContainer>
        </>
    );
}
