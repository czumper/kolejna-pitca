import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "3rem" }}
      >
        Ładowanie...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default PrivateRoute;
