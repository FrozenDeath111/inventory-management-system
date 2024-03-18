import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import "./Store.css";

const RequestShow = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    const dateOption = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
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
            let date = new Date(jsonData[index].createdAt).toLocaleString(
              "en-us",
              dateOption
            );
            let oldDate = new Date(jsonData[index].createdAt).getTime();
            let newDate = new Date().getTime();
            let dateDifference = parseInt((newDate-oldDate)/(24*3600*1000));

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

  return (
    <div className="product-container">
      <div className="product-list">
        {error && <h2 className="error-show">{error}</h2>}
        {requestData ? (
          <h1>Requests</h1>
        ) : (
          <h1 className="error-show">No Request Yet</h1>
        )}

        <table>
          <tbody className="table-body">
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
              <th>Requested For</th>
            </tr>
            {requestData &&
              requestData.map((data) => (
                <tr key={data._id}>
                  <td>{data.product_name}</td>
                  <td>{data.quantity}</td>
                  <td>{data.state}</td>
                  <td>{data.requestDate}</td>
                  <td>{data.dateDif} Days</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestShow;
