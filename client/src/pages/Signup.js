import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/Login.css';
import { useAuth } from '../contexts/AuthContext';


export default function Signup() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        setAuth({canLogin: true, userId: null, email: null, login: true});
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
                setAuth({ canLogin: false, userId: data, email, login:false});
                navigate('/my-account');
                
            } 
        } catch (error) {
            console.error("Error creating user", error);
        }
    }

    return (
        <div className='container'>
            <form>
                <div><label>Email</label></div>
                <div><input type='text' value={email} onChange={(e) => (setEmail(e.target.value))} /></div>
                <div><label>Password</label></div>
                <div><input type='password' value={pwd} onChange={(e) => (setPwd(e.target.value))} /></div>
                <div className='py-3'><p onClick={handleLogin}>Already have an account? Log in here!</p></div>
                <div><button type='submit' onClick={handleSignup}>Signup</button></div>
            </form>
        </div>
    );
}