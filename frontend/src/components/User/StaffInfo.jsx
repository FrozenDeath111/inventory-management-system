import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const StaffInfo = () => {
    const {user} = useAuthContext();
    const [error, setError] = useState(null);

    const [staffData, setStaffData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const dateOption = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };

        if(user){
            if(user.role !== 1){
                alert("You Do not Have The Authority... Reallocation...");
                navigate("/dashboard");
            }
        }

        const getUserData= async () => {
            if(user){
                const response = await fetch(
                    "http://localhost:4000/api/user/all-user-info",
                    {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                const jsonData = await response.json();

                if(!response.ok){
                    setError(jsonData.error);
                }

                if(response.ok){
                    for (let index in jsonData){
                        let date = new Date(jsonData[index].createdAt).toLocaleString(
                            "en-us",
                            dateOption
                        );
                        jsonData[index].joinDate = date;

                        if(jsonData[index].role === 1){
                            jsonData[index].designation = "Admin";
                        }

                        if(jsonData[index].role === 2){
                            jsonData[index].designation = "Warehouse Staff";
                        }

                        if(jsonData[index].role === 3){
                            jsonData[index].designation = "Store Manager";
                        }
                    }
                    setError('');
                    setStaffData(jsonData);
                }
            } else {
                setError('No User');
            }
        }
        try {
            getUserData();
        } catch (error) {
            setError(error);
        }
    },[user, navigate]);

    return (
        <div className="product-container">
            <div className="product-list">
            <h1>Staff Information</h1>
            {error && <h2 className="error-show">{error}</h2>}
            <table>
                <tbody className="table-body">
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Join Date</th>
                    </tr>
                    {
                        staffData && staffData.map(data => (
                            <tr key={data._id}>
                                <td>{data.username}</td>
                                <td>{data.name}</td>
                                <td>{data.designation}</td>
                                <td>{data.joinDate}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default StaffInfo;