import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

export default function Header() {
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div className="container">
            <nav className='bar'>
                <div className="aa">GRTNOW</div>
                <div className='row'>
                    <div className="col">
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'active' : ''}
                            onClick={() => handleLinkClick('/')}
                        >
                            Plan My Trip
                        </Link>
                    </div>
                    <div className="col">
                        <Link
                            to="/lookup-schedule"
                            className={location.pathname === '/lookup-schedule' ? 'active' : ''}
                            onClick={() => handleLinkClick('/lookup-schedule')}
                        >
                            Lookup Schedule
                        </Link>
                    </div>
                    <div className="col">
                        <Link
                            to="/upcoming-transit"
                            className={location.pathname === '/upcoming-transit' ? 'active' : ''}
                            onClick={() => handleLinkClick('/upcoming-transit')}
                        >
                            Upcoming Transit
                        </Link>
                    </div>
                    <div className="col">
                        <Link
                            to="/my-account"
                            className={location.pathname === '/my-account' ? 'active' : ''}
                            onClick={() => handleLinkClick('/my-account')}
                        >
                            My Account
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}
