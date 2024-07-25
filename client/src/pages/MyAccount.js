import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/MyAccount.css';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from './a423d8ae26b21fe5f71cf89e09cf538b.png';
import Select from 'react-select';

export default function MyAccount() {
    const [routeNames, setRouteNames] = useState([]);
    const [route, setRoute] = useState('');
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingText, setLoadingText] = useState('');
    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const navigate = useNavigate();


    // saved routes
    useEffect(() => {
        const fetchSavedRoutes = async () => {
            try {
                console.log(auth.userId);
                const url = `http://localhost:5290/getSaved/${auth.userId}`;
                const res = await fetch(url, { method: "GET" });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const resText = await res.text();
                if (resText) {
                    const data = JSON.parse(resText);
                    console.log("Fetched data:", data);
                    setSavedRoutes(data);
                    setLoading(false);
                } else {
                    console.log("No data found. The response is empty.");
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchSavedRoutes();
    }, []);

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
                    value: `${route.route_id} ${route.route_long_name}`
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

    // loading
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

    const handleLogout = async (e) => {
        e.preventDefault();
        console.log("logging out");
        setAuth({ canLogin: true, userId: null, email: null, login: true });

        // Navigate to login or home page after logout
        navigate('/login');
    }

    const handleRouteSelection = selectedOption => {
        setRoute(selectedOption ? selectedOption.value : '');
    };

    const handleAddSavedRoutes = async (e) => {
        e.preventDefault();
        if (route) {
            const firstSpaceIndex = route.indexOf(' ');
            if (firstSpaceIndex !== -1) {
                const routeId = route.substring(0, firstSpaceIndex);
                const longname = route.substring(firstSpaceIndex + 1);
                const url = `http://localhost:5290/addSaved/${auth.userId}/${routeId}/${longname}`; //add

                try {
                    const res = await fetch(url, { method: "GET" });

                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }

                    const resText = await res.text();
                    if (resText) {
                        const data = JSON.parse(resText);
                        console.log("Fetched data:", data);
                        setLoading(false);
                        handleSearchSavedRoutes();
                    } else {
                        console.log("No data found. The response is empty.");
                    }
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            } else {
                console.error("Invalid route format");
            }
        } else {
            console.error("No route selected");
        }
    }

    const handleRemoveSavedRoutes = async (routeId) => {
        try {
            const url = `http://localhost:5290/dropSaved/${auth.userId}/${routeId}`; //add
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resText = await res.text();
            if (resText) {
                const data = JSON.parse(resText);
                console.log("Fetched data:", data);
                setLoading(false);
                handleSearchSavedRoutes();
            } 
        } catch (error) {
            console.error("Error deleting saved route: ", error);
        }
    }

    const handleSearchSavedRoutes = async () => {
        console.log("userId: " + auth.userId)
        const url = `http://localhost:5290/getSaved/${auth.userId}`;
        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resText = await res.text();
            if (resText) {
                const data = JSON.parse(resText);
                console.log("Fetched data:", data);
                setSavedRoutes(data);
                setLoading(false);
            } else {
                console.log("No data found. The response is empty.");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }
    return (
        <div className="account-container">
            <div className="account-content">
                <img
                    src={userAvatar}
                    alt="User Avatar"
                    className="account-avatar"
                />
                <h1 className="account-username">{auth.email}</h1>
                <button className="logOut" onClick={handleLogout}>Log Out</button>

            </div>
            <div className='row pt-4'>
                <div className='col-9'>
                    <Select options={routeNames} value={routeNames.find(option => option.value === route)} placeholder={"Select"} onChange={handleRouteSelection} />
                </div>
                <div className='col-3'> <button onClick={handleAddSavedRoutes}>Add to saved routes</button></div>
            </div>
            <section >
                {loading ? (
                    <div>Loading{loadingText}</div>
                ) : (
                    <div className='py-5'>
                        <p>My Saved Routes</p>
                        {savedRoutes.map((s) => (
                            <div key={`${s.route_id}-${s.route_long_name}`} className="row">
                                <div className='col-8'>{s.route_id} - {s.route_long_name}</div>
                                <div className='col-4'>
                                    <button onClick={() => handleRemoveSavedRoutes(s.route_id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </section>
        </div>
    );
}