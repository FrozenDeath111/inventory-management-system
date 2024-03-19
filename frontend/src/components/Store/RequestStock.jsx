import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import "./Store";

const RequestStock = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState();

  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/get-store-data",
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
          setProducts(jsonData);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      getProducts();
    } catch (error) {
      setError(error);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestStock = async (productName, quantity) => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/request-stock",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              product_name: productName,
              quantity,
            }),
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          alert(jsonData.msg);
          setQuantity(0);
          setError('');
        }
      } else {
        setError("No User");
      }
    };

    try {
      if (!productName && !quantity) {
        setError("All Field Must Have Values...");
      } else if (quantity==0) {
        setError("Quantity Must Be More Than 0");
      } 
      else {
        requestStock(productName, quantity);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="add-product">
      <form>
        <h1>Request Product</h1>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          id="quantity"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="selection-container">
          <select defaultValue="" onChange={(e) => setProductName(e.target.value)}>
            <option value="" disabled>
              Choose Product
            </option>
            {products &&
              products.map((product) => (
                <option key={product._id} value={product.product_name}>
                  {product.product_name}
                </option>
              ))}
          </select>
          <button onClick={handleSubmit}>Request</button>
        </div>
        {error && <h2 className="error-show">{error}</h2>}
      </form>
    </div>
  );
};

export default RequestStock;
