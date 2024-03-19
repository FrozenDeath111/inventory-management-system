import { Link } from "react-router-dom";
import { useAuthContext } from "../../customHooks/useAuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import InfoIcon from "@mui/icons-material/Info";

const WarehouseStaff = () => {
  const { user } = useAuthContext();

  return (
    <div className="sidebar-items">
      {user && (
        <div className="profile">
          <h1>Profile</h1>
          <h2>Username: {user.username}</h2>
          <h3>Name: {user.name}</h3>
          <h3>Type: Warehouse Staff</h3>
        </div>
      )}

      <Link to="/dashboard">
        <DashboardIcon />
        Dashboard
      </Link>
      <Link to="/product-list-wh">
        <StoreIcon />
        Warehouse
      </Link>
      <Link to="/pending">
        <InfoIcon />
        Pending
      </Link>
    </div>
  );
};

export default WarehouseStaff;
