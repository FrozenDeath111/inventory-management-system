import WarehouseIcon from "@mui/icons-material/Warehouse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StoreIcon from "@mui/icons-material/Store";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

const AdminDash = ({ user }) => {
  const [error, setError] = useState(null);

  const [totalStock, setTotalStock] = useState(0);
  const [whStock, setWhStock] = useState(0);
  const [storeStock, setStoreStock] = useState(0);
  const [saleStock, setSaleStock] = useState(0);

  const [saleStockGD, setSaleStockGD] = useState({
    date: [],
    quantity: [],
  });

  const [whStockGD, setWhStockGD] = useState({
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
          let stockWh = 0;
          let stockStore = 0;
          let stockSale = 0;

          let saleGD = {
            date: [],
            quantity: [],
          };

          let whGD = {
            date: [],
            quantity: [],
          };

          for (let index in jsonData) {
            if (jsonData[index].state === "Received") {
              stockWh += jsonData[index].quantity;
              whGD.date.push(jsonData[index].updatedAt);
              whGD.quantity.push(jsonData[index].quantity);
            }

            if (jsonData[index].state === "Shipped") {
              stockStore += jsonData[index].quantity;
            }

            if (jsonData[index].state === "Sale") {
              stockSale += jsonData[index].quantity;
              saleGD.date.push(jsonData[index].updatedAt);
              saleGD.quantity.push(jsonData[index].quantity);
            }
          }

          let stockTotal = stockWh + stockStore - stockSale;

          stockStore -= stockSale;

          setTotalStock(stockTotal);
          setStoreStock(stockStore);
          setWhStock(stockWh);
          setSaleStock(stockSale);
          setSaleStockGD(saleGD);
          setWhStockGD(whGD);
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
      <div className="admin-dash">
        <div className="head">
          <h1>Dashboard</h1>
          {error && <h2 className="error-show">{error}</h2>}
        </div>
        <div className="item1 info">
          <div className="icon-holder">
            <span>
              <Inventory2Icon fontSize="large"></Inventory2Icon>
            </span>
            <p>Total Stock</p>
          </div>
          <div className="info-text">
            <h1>Amount</h1>
            <h1>{totalStock}</h1>
          </div>
        </div>
        <div className="item2 info">
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
        <div className="item3 info">
          <div className="icon-holder">
            <span>
              <StoreIcon fontSize="large"></StoreIcon>
            </span>
            <p>Store Stock</p>
          </div>
          <div className="info-text">
            <h1>Amount</h1>
            <h1>{storeStock}</h1>
          </div>
        </div>
        <div className="item4 info">
          <div className="icon-holder">
            <span>
              <AttachMoneyIcon fontSize="large"></AttachMoneyIcon>
            </span>
            <p>Sale Stock</p>
          </div>
          <div className="info-text">
            <h1>Amount</h1>
            <h1>{saleStock}</h1>
          </div>
        </div>
        <div className="item5">
          <div className="chart-container">
            {whStockGD && (
              <div className="chart-box">
                <Bar
                  data={{
                    labels: whStockGD.date,
                    datasets: [
                      {
                        label: "Warehouse Stock",
                        data: whStockGD.quantity,
                      },
                    ],
                  }}
                />
              </div>
            )}
            {saleStockGD && (
              <div className="chart-box">
                <Bar
                  data={{
                    labels: saleStockGD.date,
                    datasets: [
                      {
                        label: "Sale Stock",
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

export default AdminDash;
