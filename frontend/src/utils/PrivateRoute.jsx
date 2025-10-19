import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const userRole = JSON.parse(atob(token.split('.')[1])).role;
    if (userRole !== role) return <Navigate to="/" />;
  } catch {
    return <Navigate to="/" />;
  }

  return children;
}
