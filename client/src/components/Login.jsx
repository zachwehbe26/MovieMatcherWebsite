
import React, { useState } from 'react';

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            setIsLoggedIn(true);
        } else {
            alert('Login failed');
        }
    };

    const register = async () => {
        const res = await fetch('http://localhost:5000/register', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            setIsLoggedIn(true);
        } else {
            alert('Register failed');
        }
    };

    return (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ marginBottom: '10px', width: '200px', padding: '8px' }}
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ marginBottom: '20px', width: '200px', padding: '8px' }}
            /><br />
            <button onClick={login}>Log In</button>
            <p style={{ margin: '50px 0' }}></p>
            <h2>Don't have an account?</h2>
            <button onClick={register}>Register</button>
        </div>
    );
};

export default Login;