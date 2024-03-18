import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';

const StoreManager = () => {
    return (
        <div className="sidebar-items">
            <Link to="/dashboard"><DashboardIcon/>Dashboard</Link>
            <Link to="/to-be-added"><DashboardIcon/>New Products</Link>
            <Link to="/store"><DashboardIcon/>Store</Link>
            <Link to="/request_stock"><DashboardIcon/>Request Product</Link>
            <Link to="/request_show"><DashboardIcon/>Request Status</Link>
        </div>
    );
};

export default StoreManager;