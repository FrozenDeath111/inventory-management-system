import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import AdminDash from "./AdminDash";
import WarehouseDash from "./WarehouseDash";
import StoreDash from "./StoreDash";

import "./Dashboard.css";

const Dashboard = () => {
    const {user} = useAuthContext();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if(user) {
            setRole(user.role);
        }
    },[user])

    return (
        <>
            {
                role === 1  && <AdminDash user={user}></AdminDash>
            }
            {
                role === 2 && <WarehouseDash user={user}></WarehouseDash>
            }
            {
                role === 3 && <StoreDash user={user}></StoreDash>
            }
        </>
    );
};

export default Dashboard;