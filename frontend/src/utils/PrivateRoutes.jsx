import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
    let token = '';

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        token = user.token;
    } catch (error) {
        token = null;
    }

  return  token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
