import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StoreIcon from "@mui/icons-material/Store";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import { useAuthContext } from "../../customHooks/useAuthContext";

const StoreManager = () => {
  const { user } = useAuthContext();
  return (
    <div className="sidebar-items">
      {user && <div className="profile">
        <h1>Profile</h1>
        <h2>Username: {user.username}</h2>
        <h3>Name: {user.name}</h3>
        <h3>Type: Store Manager</h3>
        </div>}

      <Link to="/dashboard">
        <DashboardIcon />
        Dashboard
      </Link>
      <Link to="/to-be-added">
        <AddCircleIcon />
        New Products
      </Link>
      <Link to="/store">
        <StoreIcon />
        Store
      </Link>
      <Link to="/request_stock">
        <AddShoppingCartIcon />
        Request Product
      </Link>
      <Link to="/request_show">
        <InfoIcon />
        Request Status
      </Link>
    </div>
  );
};

export default StoreManager;
