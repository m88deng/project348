import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userAvatar from './a423d8ae26b21fe5f71cf89e09cf538b.png';
import {
    Container,
    AccountContent,
    AccountAvatar,
    AccountUsername,
    LogOut,
    CustomSelect,
    Pt4,
    SaveButton,
    SaveTripRow,
    RemoveButton
} from './../styles/MyAccount.styled.js';

export default function MyAccount() {
    const [routeNames, setRouteNames] = useState([]);
    const [route, setRoute] = useState('');
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingText, setLoadingText] = useState('');
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedRoutes = async () => {
            try {
                const url = `http://localhost:5290/getSaved/${auth.userId}`;
                const res = await fetch(url, { method: "GET" });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const resText = await res.text();
                if (resText) {
                    const data = JSON.parse(resText);
                    setSavedRoutes(data);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRoutes();
    }, [auth.userId]);

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
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
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

    const handleLogout = async (e) => {
        e.preventDefault();
        setAuth({ canLogin: true, userId: null, email: null, login: true });
        navigate('/login');
    };

    const handleRouteSelection = selectedOption => {
        setRoute(selectedOption ? selectedOption.value : '');
    };

    const handleAddSavedRoutes = async (e) => {
        e.preventDefault();
        if (route) {
            const [routeId, ...longNameParts] = route.split(' ');
            const longname = longNameParts.join(' ');
            const url = `http://localhost:5290/addSaved/${auth.userId}/${routeId}/${longname}`;

            try {
                const res = await fetch(url, { method: "GET" });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                handleSearchSavedRoutes();
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        } else {
            console.error("No route selected");
        }
    };

    const handleRemoveSavedRoutes = async (routeId) => {
        try {
            const url = `http://localhost:5290/dropSaved/${auth.userId}/${routeId}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            console.log("removed route " + routeId);
            handleSearchSavedRoutes();
        } catch (error) {
            console.error("Error deleting saved route: ", error);
        }
    };

    const handleSearchSavedRoutes = async () => {
        const url = `http://localhost:5290/getSaved/${auth.userId}`;
        try {
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const resText = await res.text();
            var data;
            if (resText) {
                data = JSON.parse(resText);
            }
            setSavedRoutes(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <AccountContent>
                <AccountAvatar
                    src={userAvatar}
                    alt="User Avatar"
                />
                <AccountUsername>{auth.email}</AccountUsername>
                <LogOut style={{ marginBottom: '20px' }} onClick={handleLogout}>Log Out</LogOut>
            </AccountContent>
            <Pt4>
                <CustomSelect
                    options={routeNames}
                    value={routeNames.find(option => option.value === route)}
                    placeholder={"Select"}
                    onChange={handleRouteSelection}
                />
                <SaveButton onClick={handleAddSavedRoutes}>Add to saved routes</SaveButton>
            </Pt4>
            <section>
                {loading ? (
                    <div>Loading{loadingText}</div>
                ) : (
                    <div className='SavedRoutesDiv'>
                        <h5 className='pb-3'>My Saved Routes</h5>
                        {savedRoutes && savedRoutes.length > 0 ? (
                            savedRoutes.map((s) => (
                                <SaveTripRow key={`${s.route_id}-${s.route_long_name}`} className="row">
                                    {s.route_id} - {s.route_long_name}
                                    <RemoveButton onClick={() => handleRemoveSavedRoutes(s.route_id)}>Remove</RemoveButton>
                                </SaveTripRow>
                            ))
                        ) : (
                            <div>You have no saved routes.</div>
                        )}
                    </div>
                )}
            </section>
        </Container>
    );
}
