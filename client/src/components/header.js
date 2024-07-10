import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className="container justify-items-center text-center py-4">
            <nav className='row'>
                <div className="col-4" style={{ cursor: "pointer" }}><Link to="/">Plan My Trip</Link></div>
                <div className="col-4" style={{ cursor: "pointer" }}><Link to="lookup-schedule">Lookup Schedule</Link></div>
                <div className="col-4" style={{ cursor: "pointer" }}><Link to="upcoming-transit">Upcoming Transit</Link></div>
            </nav>

        </div>
    );
}