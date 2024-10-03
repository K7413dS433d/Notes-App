import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
