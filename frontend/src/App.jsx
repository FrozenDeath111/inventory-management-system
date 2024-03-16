import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import AddProduct from "./components/AddProduct/AddProduct";
import PrivateRoutes from "./utils/PrivateRoutes";

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
                    <AddProduct />
                  </Layout>
                </Sidebar>
              }
              path="/add-product"
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
