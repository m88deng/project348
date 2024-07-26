import React from "react";
import Select from 'react-select';
import { useState, useEffect } from "react";
import {
    LookupScheduleForm,
    Container,
    FormGroup,
    Label,
    SearchButton,
    TransitContainer
} from "../styles/UpcomingTransit.styled";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UpcomingTransit() {
    const [stop, setStop] = useState('');
    const [stopNames, setStopNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [transitResults, setTransitResults] = useState([]);
    const [loadingText, setLoadingText] = useState('');
    const [hasInput, setHasInput] = useState(false);

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
        setHasInput(true);
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
        <>
            <Container>
                <LookupScheduleForm onSubmit={handleUpcomingTransitSearch}>
                    <FormGroup>
                        <Label htmlFor="stop">Current Stop</Label>
                        <Select id="stop" options={stopNames} placeholder={"Select a Stop"} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <SearchButton type="submit">Search</SearchButton>
                    </FormGroup>
                </LookupScheduleForm>

            </Container>
            <TransitContainer>
                {hasInput ? (
                    loading ? (
                        <div className="loadingDiv">Loading{loadingText}</div>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="Upcoming Transit Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 200 }}>Route</TableCell>
                                        <TableCell align="left">Route Direction</TableCell>
                                        <TableCell align="left">Arrival Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transitResults.map((t) => (
                                        <TableRow 
                                            key={t.route_id} className="TransitRow"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{`${t.route_id} - ${t.route_long_name}`}</TableCell>
                                            <TableCell align="left">{t.trip_headsign}</TableCell>
                                            <TableCell align="left">{t.arrival_time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )) : null}
            </TransitContainer>
        </>
    );
}
