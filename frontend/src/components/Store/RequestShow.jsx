import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import "./Store.css";

const updateRequest = async (_id, token, state, staff_username, setError) => {
  const response = await fetch(
    "http://localhost:4000/api/store/update-pending",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        _id,
        state,
        staff_username,
      })
    }
  );

  const jsonData = await response.json();

  if(!response.ok){
    setError(jsonData.error);
  }

  if(response.ok){
    alert(jsonData.msg);
  }
}

const RequestShow = () => {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState(null);

  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    const dateOption = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (user) {
      if (user.role === 1) {
        setIsAdmin(true);
      }
    }

    const getRequests = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/get-requests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          for (let index in jsonData) {
            let date = new Date(jsonData[index].updatedAt).toLocaleString(
              "en-us",
              dateOption
            );
            let oldDate = new Date(jsonData[index].updatedAt).getTime();
            let newDate = new Date().getTime();
            let dateDifference = parseInt(
              (newDate - oldDate) / (24 * 3600 * 1000)
            );
            
            if(jsonData[index].state === "Pending"){
              jsonData[index].notValidAction = false;
            } else {
              jsonData[index].notValidAction = true;
            }

            jsonData[index].requestDate = date;
            jsonData[index].dateDif = dateDifference;
          }

          setRequestData(jsonData);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      getRequests();
    } catch (error) {
      setError(error);
    }
  }, [user]);

  const handleAccept = (_id, index) => {
    let state = "To Ship";
    let staff_username = requestData[index].store_manager_username;
    let token = '';
    
    if(user){
      token = user.token;
    }

    let data = [...requestData];

    try {
      updateRequest(_id, token, state, staff_username, setError);
      data[index].state = state;
      data[index].notValidAction = true;
      setRequestData(data);
    } catch (error) {
      setError(error);
    }
  };

  const handleReject = (_id, index) => {
    let state = "Rejected";
    let staff_username = requestData[index].store_manager_username;
    let token = '';
    
    if(user){
      token = user.token;
    }

    let data = [...requestData];

    try {
      updateRequest(_id, token, state, staff_username, setError);
      data[index].state = state;
      data[index].notValidAction = true;
      setRequestData(data);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-list">
        {requestData ? (
          <h1>Requests</h1>
        ) : (
          <h1 className="error-show">No Request Yet</h1>
        )}
        {error && <h2 className="error-show">{error}</h2>}
        <table>
          <tbody className="table-body">
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              {isAdmin && <th>Store</th>}
              <th>Status</th>
              <th>Request Date</th>
              <th>Requested For</th>
              {isAdmin && <th>Action</th>}
            </tr>
            {requestData &&
              requestData.map((data, index) => (
                <tr key={data._id}>
                  <td>{data.product_name}</td>
                  <td>{data.quantity}</td>
                  {isAdmin && <td>{data.store_manager_username}</td>}
                  <td>{data.state}</td>
                  <td>{data.requestDate}</td>
                  <td>{data.dateDif} Days</td>
                  {isAdmin && (
                    <td>
                      <button
                        className="table-button"
                        onClick={() => {
                          handleAccept(data._id, index);
                        }}
                        disabled={data.notValidAction}
                      >
                        Accept
                      </button>
                      <button
                        className="table-button"
                        onClick={() => {
                          handleReject(data._id, index);
                        }}
                        disabled={data.notValidAction}
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestShow;
