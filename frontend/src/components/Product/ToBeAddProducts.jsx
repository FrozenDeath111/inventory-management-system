import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { Link } from "react-router-dom";
import "./Product.css";

const ToBeAddProducts = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/show_products",
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
          console.log(jsonData);
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

  const handleAddToStore = (_id) => {
    const data = [...products];
    const addProduct = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/add-to-store",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              product_id: _id,
            }),
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          const newData = data.filter((item) => item._id != _id);
          setProducts(newData);
          alert(jsonData.msg);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      addProduct();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-list">
        {error && <h2 className="error-show">{error}</h2>}
        <table>
          <tbody className="table-body">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
            {products &&
              products.map((product) => (
                <tr key={product._id}>
                  <td><Link to={"/product/"+product._id}>{product.name}</Link></td>
                  <td>{product.category}</td>
                  <td>
                    <button
                    className="table-button"
                      onClick={() => {
                        handleAddToStore(product._id);
                      }}
                    >
                      Add To Store
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

export default ToBeAddProducts;
