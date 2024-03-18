import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import "./Layout";

const Admin = () => {
    return (
        <div className="sidebar-items">
            <Link to="/dashboard"><DashboardIcon/>Dashboard</Link>
            <Link to="/add-product"><AddCircleIcon/>Add Product</Link>
            <Link to="/product-list"><FormatListNumberedRtlIcon/>Product List</Link>
        </div>
    );
};

export default Admin;