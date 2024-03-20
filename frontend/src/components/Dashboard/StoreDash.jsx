import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StoreIcon from "@mui/icons-material/Store";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

const StoreDash = ({ user }) => {
  const [error, setError] = useState(null);

  const [storeStock, setStoreStock] = useState(0);
  const [saleStock, setSaleStock] = useState(0);

  const [saleRecord, setSaleRecord] = useState([]);
  const [saleStockGD, setSaleStockGD] = useState({
    date: [],
    quantity: [],
  });

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
          let totalSale = 0;
          let totalStock = 0;

          let saleDataGD = {
            date: [],
            quantity: [],
          };

          for (let index in jsonData.storeStockData) {
            totalSale += jsonData.storeStockData[index].sale_stock;
            totalStock += jsonData.storeStockData[index].store_stock;
          }

          for (let index in jsonData.saleData) {
            saleDataGD.date.push(jsonData.saleData[index].updatedAt);
            saleDataGD.quantity.push(jsonData.saleData[index].quantity);
          }

          setSaleStock(totalSale);
          setStoreStock(totalStock);
          setSaleRecord(jsonData.saleData);
          setSaleStockGD(saleDataGD);
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
      <div className="store-dash">
        <div className="head">
          <h1>Dashboard</h1>
          {error && <h2 className="error-show">{error}</h2>}
        </div>
        <div className="item1 info">
          <div className="icon-holder">
            <span>
              <StoreIcon fontSize="large"></StoreIcon>
              <AttachMoneyIcon fontSize="large"></AttachMoneyIcon>
            </span>
            <p>Store Stock</p>
          </div>
          <div className="info-text">
            <h1>Total Store Stock</h1>
            <h1>{storeStock}</h1>
          </div>
          <div className="info-text">
            <h1>Total Sale Amount</h1>
            <h1>{saleStock}</h1>
          </div>
        </div>
        <div className="item2 record-area">
          <h1>Sale Record</h1>
          <div className="record-holder">
            <table>
              <tbody className="table-body">
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>state</th>
                  <th>Date</th>
                </tr>
                {saleRecord &&
                  saleRecord.map((record) => (
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
            {saleStockGD && (
              <div className="chart-box">
                <Bar
                  data={{
                    labels: saleStockGD.date,
                    datasets: [
                      {
                        label: "Receive Stock",
                        data: saleStockGD.quantity,
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

export default StoreDash;
