import React, { useState } from 'react';

const Login = ({ onLogin, onRegister }) => {
    //default registration action if not provided
    const handleRegister = () => {
        if (onRegister) {
            onRegister();
        } else {
            alert('Register button clicked!');
        }
    };
    return (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h2>Login</h2>
            <button onClick={onLogin}>Log In</button>
            <p style={{ margin: '50px 0' }}></p>
            <h2>Don't have an account?</h2>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Login;