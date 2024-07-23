import React from "react";
import Select from 'react-select';
import { useState, useEffect } from "react";
import { StyledUpcomingTransit } from "../styles/UpcomingTransit.styled";
import './UpcomingTransit.css';

export default function UpcomingTransit() {
    const [stop, setStop] = useState('');
    const [stopNames, setStopNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transitResults, setTransitResults] = useState([]);
    const [loadingText, setLoadingText] = useState('');

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

    const handleChange = selectedOption => {
        setStop(selectedOption ? selectedOption.value : '');
    };

    const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    const getCurrentDate = () => {
        const date = new Date();
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    };

    const encodeSlash = (input) => {
        return input.replace(/\//g, '%2F');
    };

    const handleUpcomingTransitSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(stop, getCurrentDate(), getCurrentTime());
        const url = `http://localhost:5290/4/${encodeSlash(stop)}/${getCurrentDate()}/${getCurrentTime()}`;

        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resText = await res.text();
            if (resText) {
                const data = JSON.parse(resText);
                console.log("Fetched data:", data);
                setTransitResults(data);
            } else {
                console.log("No data found. The response is empty.");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <StyledUpcomingTransit className="container">
            <form>
                <div><label>Current Stop</label></div>
                <Select options={stopNames} placeholder={"Select a Stop"} onChange={handleChange} />
                <div><button type="submit" onClick={handleUpcomingTransitSearch}>Search</button></div>
            </form>
            <section className="container">
                {loading ? (
                    <div>Loading{loadingText}</div>
                ) : (transitResults.map((t) => (
                    <div key={t.route_id} className="row">
                        <div className="py-2" >{`${t.route_id} ${t.route_long_name} - ${t.trip_headsign} ${t.arrival_time}`}</div>
                    </div>
                ))
                )}
            </section>
        </StyledUpcomingTransit>
    );
}
