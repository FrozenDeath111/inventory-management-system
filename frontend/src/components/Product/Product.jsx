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

  useEffect(() => {
    const dateOption = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
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
            let date = new Date(jsonData.productHistory[index].createdAt).toLocaleString(
              "en-us",
              dateOption
            );
            jsonData.productHistory[index]["additionDate"] = date;
          }
          setProductHistory(jsonData.productHistory);
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
        {
            productDetails && ( <div className="description-style">
                <h3>Name: {productDetails.name}</h3>
                <h4>Categoty: {productDetails.category}</h4>
                <p>Details: {productDetails.details}</p>
            </div> )
        }
      </div>
      <div className="product-history">
        <h1>Product History</h1>
        {
            productHistory && productHistory.map((history) => 
            <div key={history._id} className="history-style">
                <h3>State: {history.state}</h3>
                <h4>Issue Date: {history.additionDate}</h4>
                <h4>Issue By: {history.warehouse_staff_username}</h4>
            </div>)
        }
      </div>
    </div>
  );
};

export default Product;
