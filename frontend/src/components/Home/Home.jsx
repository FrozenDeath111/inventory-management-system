import { useState } from "react";
import "./Home.css";
import { useLogin } from "../../customHooks/useLogin";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const enableLogin = props.loginHandle[0];
  const setEnableLogin = props.loginHandle[1];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, error } = useLogin();

  const handleLoginShow = () => {
    setEnableLogin(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(username, password);

    navigate("/dashboard");
  };

  return (
    <div className="home">
      <h1>Wave Through Your Inventory</h1>
      <img
        src="/wave.svg"
        className={enableLogin ? "bg-image-blur" : "bg-image"}
        id="bg-image"
        alt=""
      />
      {enableLogin ? (
        <div className="login-form" id="login-form">
          <form>
            <h3>Login Form</h3>
            <input
              className="input-area"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              placeholder="Username"
            />
            <input
              className="input-area"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
            />
            <div className="button-container">
              <button onClick={handleLogin} disabled={isLoading}>
                Submit
              </button>
              <button onClick={handleLoginShow}>Cancel</button>
            </div>
            {error && <p>{error}</p>}
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
