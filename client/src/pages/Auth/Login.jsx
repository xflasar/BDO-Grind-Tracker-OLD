import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const res = await response.json();
      document.cookie = `token=${res.accessToken}; path=/;`;
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    // implement your forgot password functionality here
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username/Email:</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} />
        <button type="submit">Login</button>
      </form>
      <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
    </div>
  );
};

export default Login;
