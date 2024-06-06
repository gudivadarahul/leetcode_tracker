import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { auth } = useAuth();
  return (
    <div>
      <h2>Home Page</h2>
      <nav>
        {!auth.token && <Link to="/login">Login</Link>}
        {!auth.token && <Link to="/signup">Signup</Link>}
        {auth.token && <Link to="/dashboard">Dashboard</Link>}
      </nav>
    </div>
  );
};

export default Home;
