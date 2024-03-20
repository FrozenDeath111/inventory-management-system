import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import AddProduct from "./components/AddProduct/AddProduct";
import ProductList from "./components/Product/ProductList";
import Product from "./components/Product/Product";
import PrivateRoutes from "./utils/PrivateRoutes";
import ToBeAddProducts from "./components/Product/ToBeAddProducts";
import Store from "./components/Store/Store";
import RequestStock from "./components/Store/RequestStock";
import RequestShow from "./components/Store/RequestShow";
import Warehouse from "./components/Warehouse/Warehouse";
import ProductListWH from "./components/Warehouse/ProductListWH";
import StaffInfo from "./components/User/StaffInfo";
import StaffRegister from "./components/User/StaffRegister";

function App() {
  const [enableLogin, setEnableLogin] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            element={<Navbar loginHandle={setEnableLogin}><Home loginHandle={[enableLogin, setEnableLogin]} /></Navbar>}
            path="/"
          />
          <Route element={<PrivateRoutes />}>
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </Sidebar>
              }
              path="/dashboard"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <StaffInfo />
                  </Layout>
                </Sidebar>
              }
              path="/staff-info"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <StaffRegister />
                  </Layout>
                </Sidebar>
              }
              path="/register"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <AddProduct />
                  </Layout>
                </Sidebar>
              }
              path="/add-product"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <ProductList />
                  </Layout>
                </Sidebar>
              }
              path="/product-list"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <ProductListWH />
                  </Layout>
                </Sidebar>
              }
              path="/product-list-wh"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <Product />
                  </Layout>
                </Sidebar>
              }
              path="/product/:_id"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <ToBeAddProducts />
                  </Layout>
                </Sidebar>
              }
              path="/to-be-added"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <Store />
                  </Layout>
                </Sidebar>
              }
              path="/store"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <RequestStock />
                  </Layout>
                </Sidebar>
              }
              path="/request_stock"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <RequestShow />
                  </Layout>
                </Sidebar>
              }
              path="/request_show"
            />
            <Route
              element={
                <Sidebar>
                  <Layout>
                    <Warehouse />
                  </Layout>
                </Sidebar>
              }
              path="/pending"
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
