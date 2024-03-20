import WarehouseIcon from "@mui/icons-material/Warehouse";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

const WarehouseDash = ({ user }) => {
  const [error, setError] = useState(null);

  const [whStock, setWhStock] = useState(0);
  const [whStockGD, setWhStockGD] = useState({
    date: [],
    quantity: [],
  });

  const [shipStockGD, setShipStockGD] = useState({
    date: [],
    quantity: [],
  });

  const [staffRecord, setStaffRecord] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/products/dashboard-data",
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
          let stockWh = 0;

          let whGD = {
            date: [],
            quantity: [],
          };

          let shipGD = {
            date: [],
            quantity: [],
          };

          let record = [];

          for (let index in jsonData) {
            if (jsonData[index].state === "Received") {
              stockWh += jsonData[index].quantity;
              whGD.date.push(jsonData[index].updatedAt);
              whGD.quantity.push(jsonData[index].quantity);
            }

            if (jsonData[index].state === "Shipped") {
              shipGD.date.push(jsonData[index].updatedAt);
              shipGD.quantity.push(jsonData[index].quantity);
            }

            if (jsonData[index].staff_username === user.username) {
              record.push(jsonData[index]);
            }
          }

          setWhStock(stockWh);
          setWhStockGD(whGD);
          setShipStockGD(shipGD);
          setStaffRecord(record);
          console.log(record);
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

  return (
    <div className="grid-container">
      <div className="warehouse-dash">
        <div className="head">
          <h1>Dashboard</h1>
          {error && <h2 className="error-show">{error}</h2>}
        </div>
        <div className="item1 info">
          <div className="icon-holder">
            <span>
              <WarehouseIcon fontSize="large"></WarehouseIcon>
            </span>
            <p>Warehouse Stock</p>
          </div>
          <div className="info-text">
            <h1>Amount</h1>
            <h1>{whStock}</h1>
          </div>
        </div>
        <div className="item2 record-area">
          <h1>Staff Record</h1>
          <div className="record-holder">
            <table>
              <tbody className="table-body">
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>state</th>
                  <th>Date</th>
                </tr>
                {staffRecord &&
                  staffRecord.map((record) => (
                    <tr key={record._id}>
                      <td>{record.product_name}</td>
                      <td>{record.quantity}</td>
                      <td>{record.state}</td>
                      <td>{record.updatedAt}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="item3">
          <div className="chart-container">
            {whStockGD && (
              <div className="chart-box">
                <Bar
                  data={{
                    labels: whStockGD.date,
                    datasets: [
                      {
                        label: "Receive Stock",
                        data: whStockGD.quantity,
                      },
                    ],
                  }}
                />
              </div>
            )}
            {shipStockGD && (
              <div className="chart-box">
                <Bar
                  data={{
                    labels: shipStockGD.date,
                    datasets: [
                      {
                        label: "Ship Stock",
                        data: shipStockGD.quantity,
                      },
                    ],
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDash;
