import { useEffect, useState } from "react";
import "./Product.css";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { Link } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductList = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [productList, setProductList] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [warehouseStaffNames, setWarehouseStaffNames] = useState([]);

  useEffect(() => {
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
          for (let index in jsonData.products) {
            jsonData.products[index]["addStock"] = 0;
          }
          setProductList(jsonData.products);
          setWarehouseStaffNames(jsonData.staffNames);
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

  const handleIncrement = (index) => {
    let data = [...productList];

    if (data[index].addStock <= 500) {
      data[index].addStock += 1;
      setProductList(data);
    }
  };

  const handleDecrement = (index) => {
    let data = [...productList];

    if (data[index].addStock > 0) {
      data[index].addStock -= 1;
      setProductList(data);
    }
  };

  const handleUpdate = (product_id, index) => {
    let data = [...productList];
    let addAmount = productList[index].addStock;

    const addProduct = async () => {
      const response = await fetch(
        "http://localhost:4000/api/products/add-product",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            product_id,
            addAmount,
            staffName,
          }),
        }
      );

      const jsonData = await response.json();

      if(!response.ok){
        setError(jsonData.error);
      }

      if(response.ok){
        alert(jsonData.msg);
        data[index].stock += addAmount;
        data[index].addStock = 0;
        setProductList(data);
        setError('');
      }
    };

    try {
      if (addAmount === 0) {
        setError("Please Add Amount");
      } else if (!staffName) {
        setError("Please Select Staff");
      } else {
        addProduct();
      }
    } catch (error) {
      setError(error);
    }
  };

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
              <th>Add Amount</th>
              <th>Update</th>
            </tr>
            {productList &&
              productList.map((data, index) => (
                <tr key={data._id}>
                  <td>
                    <Link to={"/product/" + data._id}>{data.name}</Link>
                  </td>
                  <td>{data.category}</td>
                  <td>{data.stock}</td>
                  <td>
                    <div className="td-button">
                      <button
                        className="table-button"
                        onClick={() => {
                          handleIncrement(index);
                        }}
                      >
                        <AddIcon />
                      </button>
                      {data.addStock}
                      <button
                        className="table-button"
                        onClick={() => {
                          handleDecrement(index);
                        }}
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="selection-list-prodlist">
                      <button
                        onClick={() => {
                          handleUpdate(data._id, index);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="staff-select-area">
          <select
            className="staff-select"
            defaultValue={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          >
            <option value="" disabled>
              Chose Staff
            </option>
            {warehouseStaffNames &&
              warehouseStaffNames.map((name) => (
                <option key={name._id} value={name.username}>
                  {name.username}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
