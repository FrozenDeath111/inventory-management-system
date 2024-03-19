import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import "./Layout.css";

import Admin from "./Admin";
import StoreManager from "./StoreManager";
import ExitToApp from "@mui/icons-material/ExitToApp";
import { useLogout } from "../../customHooks/useLogout";
import { useNavigate } from "react-router-dom";
import WarehouseStaff from "./WarehouseStaff";

const Sidebar = ({children}) => {
    const { user } = useAuthContext();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isWarehouseStaff, setIsWarehouseStaff] = useState(false);
    const [isStoreManager, setIsStoreManager] = useState(false);

    const { logout } = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
        if(user){
            if(user.role === 1){
                setIsAdmin(true);
                setIsWarehouseStaff(false);
                setIsStoreManager(false);
            }
            else if(user.role === 2){
                setIsAdmin(false);
                setIsWarehouseStaff(true);
                setIsStoreManager(false);
            }
            else {
                setIsAdmin(false);
                setIsWarehouseStaff(false);
                setIsStoreManager(true);
            }
        }
    },[user]);

    return (
        <div className="sidebar">
            <div className="sidebar-container">
                {
                    isAdmin && <Admin></Admin>
                }
                {
                    isWarehouseStaff && <WarehouseStaff></WarehouseStaff>
                }
                {
                    isStoreManager && <StoreManager></StoreManager>
                }
                <div className="logout-button">
                    <button onClick={handleLogout}><ExitToApp />Logout</button>
                </div>
            </div>
            <div className="container">
            {children}
            </div>
        </div>
    );
};

export default Sidebar;