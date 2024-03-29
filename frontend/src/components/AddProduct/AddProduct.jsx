import { useEffect, useState } from "react";
import "./AddProduct.css";
import { useAuthContext } from "../../customHooks/useAuthContext";

const AddProduct = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [staffName, setStaffName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [warehouseStaffNames, setWarehouseStaffNames] = useState([]);

  useEffect(() => {
    const getStaffNames = async () => {
      if (user) {
        const response = await fetch(
          "http://localhost:4000/api/user/all-warehouse-staff",
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
          setWarehouseStaffNames(jsonData);
          setError("");
        }
      } else {
        setError("Null User");
      }
    };

    try {
      getStaffNames();
    } catch (error) {
      setError(error);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !category || !details || !quantity || !staffName) {
      setError("One or More Field is empty");
    } else {
      const sendData = async () => {
        const response = await fetch(
          "http://localhost:4000/api/products/create-product",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              name: productName,
              category,
              details,
              quantity,
              staff_username: staffName,
            }),
          }
        );

        const jsonData = await response.json();

        if(response.ok){
          alert(jsonData.msg);
          setProductName('');
          setCategory('');
          setDetails('');
          setQuantity(0);
          setStaffName('');
          setError('');
        }

        if(!response.ok){
          setError(jsonData.error);
        }
      };

      try {
        sendData();
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <div className="add-product">
      <form>
        <h1>Add Product</h1>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="textarea"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="selection-container">
          <select
            defaultValue={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          >
            <option value="" disabled>
              Chose Warehouse Staff
            </option>
            {warehouseStaffNames && warehouseStaffNames.map((name) => (
              <option key={name._id} value={name.username}>
                {name.username}
              </option>
            ))}
          </select>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {error && <h2 className="error-show">{error}</h2>}
      </form>
    </div>
  );
};

export default AddProduct;
