// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceTable from './components/InvoiceTable';
import Register from './components/Register';
import Login from './components/Login';

const PrivateRoute = ({ element }) => {
  // Check if the user is authenticated (you may use your own authentication logic)
  const isAuthenticated = localStorage.getItem('token') !== null;

  // If authenticated, render the provided element; otherwise, redirect to the landing page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  // Check if the user is authenticated (you may use your own authentication logic)
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />

          {/* Use the PrivateRoute for the InvoiceTable */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<InvoiceTable />} />}
          />
        </Routes>
      </>
    </Router>
  );
};

export default App;
