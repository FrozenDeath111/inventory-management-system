import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import Admin from "./Admin";
import "./Layout.css";

const Sidebar = ({children}) => {
    const { user } = useAuthContext();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isWarehouseStaff, setIsWarehouseStaff] = useState(false);
    const [isStoreManager, setIsStoreManager] = useState(false);

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
                    isWarehouseStaff && <h1>WS</h1>
                }
                {
                    isStoreManager && <h1>SM</h1>
                }
            </div>
            <div className="container">
            {children}
            </div>
        </div>
    );
};

export default Sidebar;