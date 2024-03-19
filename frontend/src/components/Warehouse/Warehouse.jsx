import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";

const Warehouse = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/products/get-activity",
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
          setRequestData(jsonData);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      getData();
    } catch (error) {
      setError(error);
    }
  }, [user]);

  const handleAccept = (_id, index) => {
    let data = [...requestData];
    let requestedStock = requestData[index].quantity;
    let warehouseStock = requestData[index].wh_stock;
    let store_username = requestData[index].staff_username;
    let request_id = requestData[index].request_id || '';
    let state = requestData[index].state;
    let product_id = requestData[index].product_id;

    const updateStock = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/products/update-stock",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              _id,
              requestedStock,
              warehouseStock,
              request_id,
              store_username,
              state,
              product_id,
              action: true,
            }),
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          alert(jsonData.msg);
          if(state === "To Ship"){
            data[index].state = "Shipped";
          }
          else {
            data[index].state = "Received";
          }
          setRequestData(data);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      if(requestedStock <= warehouseStock || state === "To Receive"){
        updateStock();
      }
      else {
        setError("Requested Stock More Than Available Stock");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleReject = (_id, index) => {
    let data = [...requestData];
    let requestedStock = requestData[index].quantity;
    let state = requestData[index].state;
    let product_id = requestData[index].product_id;
    let request_id = requestData[index].request_id || '';

    const updateStock = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/products/update-stock",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              _id,
              requestedStock,
              state,
              product_id,
              request_id,
              action: false,
            }),
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          alert(jsonData.msg);
          data[index].state = "Rejected";
          setRequestData(data);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
        updateStock();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-list">
        {error && <h2 className="error-show">{error}</h2>}
        {requestData ? (
          <h1>Warehouse Activity</h1>
        ) : (
          <h1 className="error-show">No Request Yet</h1>
        )}

        <table>
          <tbody className="table-body">
            <tr>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Requested</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            {requestData &&
              requestData.map((data, index) => (
                <tr key={data._id}>
                  <td>{data.product_name}</td>
                  <td>{data.wh_stock}</td>
                  <td>{data.quantity}</td>
                  <td>{data.state}</td>
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Warehouse;
