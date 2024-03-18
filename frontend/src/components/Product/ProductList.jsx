import { useEffect, useState } from "react";
import "./Product.css";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";

const ProductList = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const [productList, setProductList] = useState([]);

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
            let date = new Date(jsonData[index].createdAt).toLocaleString(
              "en-us",
              dateOption
            );
            jsonData[index]["additionDate"] = date;
          }
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

  const tableStyle = {
    minWidth: 650,
    backgroundColor: "rgb(228, 241, 255)",
  };

  const handlePagination = (e) => {
    console.log(e.target.textContent);
  }

  return (
    <div className="product-container">
      <div className="product-list">
        {error && <h2 className="error-show">{error}</h2>}
        <TableContainer component={Paper}>
          <Table sx={{ tableStyle }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Warehouse Stock</TableCell>
                <TableCell align="right">Addition Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link to={"/product/"+row._id}>{row.name}</Link>
                  </TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.stock}</TableCell>
                  <TableCell align="right">{row.additionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="pagination">
          <Pagination count={10} variant="outlined" shape="rounded" onChange={handlePagination} />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
