import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  );
};

export default Home;
