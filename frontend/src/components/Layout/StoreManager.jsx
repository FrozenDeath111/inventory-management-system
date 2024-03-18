import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';

const StoreManager = () => {
    return (
        <div className="sidebar-items">
            <Link to="/dashboard"><DashboardIcon/>Dashboard</Link>
            <Link to="/to-be-added"><DashboardIcon/>Products</Link>
        </div>
    );
};

export default StoreManager;