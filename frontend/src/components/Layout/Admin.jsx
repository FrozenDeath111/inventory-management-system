import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./Layout";

const Admin = () => {
    return (
        <div className="sidebar-items">
            <Link to="/dashboard"><DashboardIcon/>Dashboard</Link>
            <Link to="/add-product"><AddCircleIcon/>Add Product</Link>
        </div>
    );
};

export default Admin;