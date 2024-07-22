import React from 'react';
import { Link } from 'react-router-dom';
import './MyAccount.css';
import userAvatar from './a423d8ae26b21fe5f71cf89e09cf538b.png'; 

export default function MyAccount() {
    return (
        <div className="account-container">
            <div className="account-content">
                <img 
                    src={userAvatar} 
                    alt="User Avatar" 
                    className="account-avatar" 
                />
                <h1 className="account-username">Username</h1>
                <p className="account-role">Passenger</p>
                <button className="account-button">Check Saved Routes</button>
            </div>
        </div>
    );
}
