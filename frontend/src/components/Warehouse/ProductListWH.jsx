import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { Link } from "react-router-dom";

const ProductListWH = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [productList, setProductList] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const dateOption = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const getProducts = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/products/get-products",
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
            jsonData[index].date = date;
          }
          setPageCount(jsonData.length/10);
          setProductList(jsonData);
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

  return (
    <div className="product-container">
      <div className="product-list">
        <h1>Product List</h1>
        {error && <h2 className="error-show">{error}</h2>}
        <table>
          <tbody className="table-body">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Date</th>
            </tr>
            {productList &&
              productList.map((data) => (
                <tr key={data._id}>
                  <td>
                    <Link to={"/product/" + data._id}>{data.name}</Link>
                  </td>
                  <td>{data.category}</td>
                  <td>{data.stock}</td>
                  <td>{data.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListWH;
