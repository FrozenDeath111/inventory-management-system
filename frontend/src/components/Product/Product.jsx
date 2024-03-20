import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import "./Product.css";
import { useParams } from "react-router-dom";

const Product = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const { _id } = useParams();

  const [productDetails, setProductDetails] = useState({});
  const [productHistory, setProductHistory] = useState([]);

  const [isAdmin, setIsAdmin] = useState(null);
  const [isWS, setIsWS] = useState(null);
  const [isSM, setIsSM] = useState(null);

  const [totalStock, setTotalStock] = useState(0);
  const [warehouseStock, setWarehouseStock] = useState(0);
  const [allStoreStock, setAllStoreStock] = useState(0);
  const [saleStock, setSaleStock] = useState(0);

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
        setIsWS(false);
        setIsSM(false);
      } else if (user.role === 2) {
        setIsAdmin(false);
        setIsWS(true);
        setIsSM(false);
      } else if (user.role === 3) {
        setIsAdmin(false);
        setIsWS(false);
        setIsSM(true);
      }
    }
    const getData = async () => {
      if (user) {
        const response = await fetch(
          `http://localhost:4000/api/products/${_id}`,
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
          setProductDetails(jsonData.productDetails);
          for (let index in jsonData.productHistory) {
            let date = new Date(
              jsonData.productHistory[index].createdAt
            ).toLocaleString("en-us", dateOption);
            jsonData.productHistory[index]["additionDate"] = date;
          }

          setProductHistory(jsonData.productHistory);

          let whStock = jsonData.productStock.warehouseStock;
          let storeStock = jsonData.productStock.storeStock;
          let saleStock = jsonData.productStock.saleStock;

          setWarehouseStock(whStock);
          setSaleStock(saleStock);
          setAllStoreStock(storeStock);
          setTotalStock(whStock+storeStock);
          setError("");
        }
      } else {
        setError("Error While Fetching Data...");
      }
    };
    try {
      getData();
    } catch (error) {
      setError(error);
    }
  }, [user, _id]);

  return (
    <div className="product-container">
      <div className="product-info">
        <h1>Product Information</h1>
        {error && <h2 className="error-show">{error}</h2>}
        {productDetails && (
          <div className="description-style">
            <h1>Name: {productDetails.name}</h1>
            <h3>Category: {productDetails.category}</h3>
            <p>Details: {productDetails.details}</p>
            {
              isAdmin && <>
                <h3>In Stock: {totalStock}</h3>
                <h3>Warehouse Stock: {warehouseStock}</h3>
                <h3>Stock in Stores: {allStoreStock}</h3>
                <h3>Sold Stock: {saleStock}</h3>
                </>
            }
            {
              isWS && <>
                <h3>In Stock: Unavailable</h3>
                <h3>Warehouse Stock: {warehouseStock}</h3>
                <h3>Stock in Stores: Unavailable</h3>
                <h3>Sold Stock: Unavailable</h3>
                </>
            }
            {
              isSM && <>
                <h3>In Stock: Unavailable</h3>
                <h3>Warehouse Stock: {warehouseStock}</h3>
                <h3>Stock in Store: {allStoreStock}</h3>
                <h3>Sold Stock: {saleStock}</h3>
                </>
            }
          </div>
        )}
      </div>
      <div className="product-history">
        <h1>Product History</h1>
        <div className="history-holder">
          {productHistory &&
            productHistory.map((history) => (
              <div key={history._id} className="history-style">
                <h3>State: {history.state}</h3>
                <h4>Quantity: {history.quantity}</h4>
                <h4>Issue Date: {history.additionDate}</h4>
                <h4>Issue By: {history.staff_username}</h4>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
