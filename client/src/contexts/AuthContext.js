import React, { createContext, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ canLogin: true, userId: null, email: null, login: true });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
