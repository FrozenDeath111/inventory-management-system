import { Link } from "react-router-dom";
import { useAuthContext } from "../../customHooks/useAuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InfoIcon from '@mui/icons-material/Info';
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "./Layout";

const Admin = () => {
  const { user } = useAuthContext();

  return (
    <div className="sidebar-items">
      {user && (
        <div className="profile">
          <h1>Profile</h1>
          <h2>Username: {user.username}</h2>
          <h3>Name: {user.name}</h3>
          <h3>Type: Admin</h3>
        </div>
      )}
      <Link to="/dashboard">
        <DashboardIcon />
        Dashboard
      </Link>
      <Link to="/add-product">
        <AddCircleIcon />
        Add Product
      </Link>
      <Link to="/product-list">
        <FormatListNumberedRtlIcon />
        Product List
      </Link>
      <Link to="/request_show">
        <InfoIcon />
        Request Status
      </Link>
      <Link to="/staff-info">
        <PeopleAltIcon />
        Staff Data
      </Link>
      <Link to="/register">
        <PersonAddIcon />
        Staff Register
      </Link>
    </div>
  );
};

export default Admin;
