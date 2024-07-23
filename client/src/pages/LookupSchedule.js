import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    LookupScheduleForm,
    FormGroup,
    Label,
    FormControl,
    CheckboxLabel,
    Checkbox,
    SearchButton
} from "../styles/LookupSchedule.styled";
import Select from 'react-select';


export default function LookupSchedule() {
    const [route, setRoute] = useState('');
    const [direction, setDirection] = useState('');
    const [wheelchair, setWheelchair] = useState(0);

    const [routeNames, setRouteNames] = useState([]);
    const [headsignNames, setHeadsignNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchHeadsign = async () => {
            try {
                const response = await fetch(`http://localhost:5290/2/${route}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const formattedData = data.map(route => ({
                    label: route.trip_headsign,
                    value: route.trip_headsign
                }));

                setHeadsignNames(formattedData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }

        };

        if (route != '') { fetchHeadsign(); }
        else {
            console.log("no route");
        }
    }, [route]);
    if (loading) return "Loading";
    if (error) return <pre>{error.message}</pre>;


    const handleRouteChange = selectedOption => {
        setRoute(selectedOption ? selectedOption.value : '');
    };

    const handleHeadsignChange = selectedOption => {
        setDirection(selectedOption ? selectedOption.value : '');
    };


    var url = `http://localhost:5290/7/${route}/${direction}`;
    const handleScheduleSearch = async (e) => {
        e.preventDefault();
        // For the sake of example, we'll use a static list of stops
        const stops = ["Stop 1", "Stop 2", "Stop 3", "Stop 4"];

        const today = new Date().toISOString().slice(0, 10);
        navigate("/route-stops", {
            state: {
                date: today,
                route,
                direction,
                stops
            }
        });
        if (wheelchair) {
            url = `http://localhost:5290/8/${route}/${direction}`;
        }

        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Fetched data:", data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const handleWheelchairStopSearch = async (e) => {
        url = 'http://localhost:5290/3';
        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Fetched data:", data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    return (
        <div>
            <Container>
                <LookupScheduleForm onSubmit={handleScheduleSearch}>
                    <FormGroup>
                        <Label htmlFor="route">Route</Label>
                        <FormControl
                            type="text"
                            id="route"
                            value={route}
                            onChange={(e) => setRoute(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="direction">Direction</Label>
                        <FormControl
                            type="text"
                            id="direction"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                        />
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
                        <SearchButton type="submit">Lookup</SearchButton>
                    </FormGroup>
                </LookupScheduleForm>
            </Container>
        </div>
    );
}
