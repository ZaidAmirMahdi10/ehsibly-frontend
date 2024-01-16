// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceTable from './components/InvoiceTable';
import Register from './components/Register';
import Login from './components/Login';
import LandingPage from './components/LandingPage';

const PrivateRoute = ({ element }) => {
  // Check if the user is authenticated (you may use your own authentication logic)
  const isAuthenticated = localStorage.getItem('token') !== null;

  // If authenticated, render the provided element; otherwise, redirect to the landing page
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  // Check if the user is authenticated (you may use your own authentication logic)
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          {/* Use the PrivateRoute for the InvoiceTable */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<InvoiceTable />} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
