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

export default function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [invalidLogin, setInvalidLogin] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSignup = () => {
        setAuth({canLogin: true, userId: null, email: null, login: false});
        navigate('/signup');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        var url = `http://localhost:5290/login/${email}/${pwd}`;

        try {
            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const resText = await res.text();
            if (resText) {
                try{
                    const data = JSON.parse(resText);
                    console.log("Fetched data:", data);
                    console.log("userId: "+data[0].user_id);
                    setAuth({ canLogin: false, userId: data[0].user_id, email, login: true});
                    setInvalidLogin("");
                    navigate('/my-account');
                } catch(error){
                    setInvalidLogin("Incorrect email / password");
                    console.log("Incorrect email / password.");
                }
            } 
        } catch (error) {
            console.error("Error finding user", error);
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
                <div className='small' style={{textAlign:'center', color: '#ff1a1a'}}><label>{invalidLogin}</label></div>
                <div className='py-3'>
                    <p style={{display:'flex'}} onClick={handleSignup}>Don't have an account? <div style={{marginLeft:'10px', color:'blue',cursor: 'pointer'}}>Sign up here!</div></p>
                </div>
                <SearchButton type='submit' onClick={handleLogin}>Login</SearchButton>
            </PlanTripForm>
        </Container>
    );
}
