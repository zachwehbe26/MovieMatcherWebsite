import React, { useState } from 'react';

const Login = ({ onLogin }) => (

    <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2>Login</h2>
        <button onClick={onLogin}>Log In</button>
    </div>  
);

export default Login;