import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./Store.css";
import { Link } from "react-router-dom";

const Store = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    const getStoreData = async () => {
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
          for (let index in jsonData) {
            jsonData[index].toSale = 0;
            jsonData[index].notValidUpdate = true;
          }

          setStoreData(jsonData);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      getStoreData();
    } catch (error) {
      setError(error);
    }
  }, [user]);

  const handleIncrement = (index) => {
    const data = [...storeData];

    if (data[index].store_stock > 0) {
      data[index].store_stock -= 1;
      data[index].sale_stock += 1;
      data[index].toSale += 1;
      data[index].notValidUpdate = false;
      setStoreData(data);
    }
  };

  const handleDecrement = (index) => {
    const data = [...storeData];

    if (data[index].toSale > 0) {
      data[index].store_stock += 1;
      data[index].sale_stock -= 1;
      data[index].toSale -= 1;
      data[index].notValidUpdate = false;
      setStoreData(data);
    }
  };

  const handleUpdate = (index, _id, product_name) => {
    const data = [...storeData];
    const updateStore = async (
      _id,
      store_stock,
      sale_stock,
      toSale,
      product_name
    ) => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/store/update-store",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              _id,
              product_name,
              store_stock,
              sale_stock,
              toSale,
            }),
          }
        );

        const jsonData = await response.json();

        if (!response.ok) {
          setError(jsonData.error);
        }

        if (response.ok) {
          jsonData.toSale = 0;
          jsonData.notValidUpdate = true;
          data[index] = jsonData;
          setStoreData(data);
          setError("");
        }
      } else {
        setError("No User");
      }
    };

    try {
      updateStore(
        _id,
        storeData[index].store_stock,
        storeData[index].sale_stock,
        storeData[index].toSale,
        product_name
      );
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
              <th>Store Stock</th>
              <th>To Sale</th>
              <th>Sale Stock</th>
              <th>Update</th>
            </tr>
            {storeData &&
              storeData.map((data, index) => (
                <tr key={data._id}>
                  <td><Link to={"/product/"+data.product_id}>{data.product_name}</Link></td>
                  <td>{data.product_category}</td>
                  <td>{data.store_stock}</td>
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
                      {data.toSale}
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
                  <td>{data.sale_stock}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={() => {
                        handleUpdate(index, data._id, data.product_name);
                      }}
                      disabled={data.notValidUpdate}
                    >
                      Update
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

export default Store;
