import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    PlanTripForm,
    FormGroup,
    Label,
    FormControl,
    SearchButton
} from '../styles/Login.styled.js';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [invalidSignup, setInvalidSignup] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        setAuth({ canLogin: true, userId: null, email: null, login: true });
        navigate('/login');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log(email, pwd);
        var url = `http://localhost:5290/register/${email}/${pwd}`;

        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const resText = await res.text();
            if (resText) {
                    const data = JSON.parse(resText);
                    console.log("Fetched data:", data);
                    setAuth({ canLogin: false, userId: data, email, login: false });
                    setInvalidSignup("");
                    navigate('/my-account');
                
            }
        } catch (error) {
            setInvalidSignup("This email was already used.")
            console.error("Error creating user", error);
        }
    }

    return (
        <Container>
            <PlanTripForm>
                <FormGroup>
                    <Label>Email</Label>
                    <FormControl type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label>Password</Label>
                    <FormControl type='password' value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </FormGroup>
                <div className='small' style={{ textAlign: 'center', color: '#ff1a1a' }}><label>{invalidSignup}</label></div>
                <div className='py-3'>
                    <p onClick={handleLogin} style={{ display: 'flex' }} >Already have an account?<div style={{ color: 'blue', cursor: 'pointer', marginLeft: '10px' }}>Sign in here!</div></p>
                </div>
                <SearchButton type='submit' onClick={handleSignup}>Signup</SearchButton>
            </PlanTripForm>
        </Container>
    );
}
