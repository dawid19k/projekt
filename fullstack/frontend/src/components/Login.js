import React, { useState } from 'react';

const Login = ({ login }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <form style={{ textAlign: 'center', margin: '50px' }} onSubmit={handleSubmit}>
            
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
