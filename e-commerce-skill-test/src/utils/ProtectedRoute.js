import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/authReducer";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn } = useSelector(authSelector);
    const location = useLocation();

    return isLoggedIn ? children : <Navigate to="/user/signin" state={{ from: location }} replace />;
}
