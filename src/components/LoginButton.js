import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogin}>Log in with Spotify</button>
  );
};

export default LoginButton;
