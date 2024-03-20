import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { useLogout }from "../../customHooks/useLogout";
import "./Navbar.css";

const Navbar = ({loginHandle, children}) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const setEnableLogin = loginHandle;

const handleLogout = () => {
    logout();

    navigate("/");
}

const handleLoginShow = () => {
    setEnableLogin(true);
}

const toDashboard = () => {
  navigate("/dashboard")
}

  return (
    <>
    <div className="navbar">
      <div className="nav-element">
        <Link to="/">
          <img id="logo" src="/iconInv.png" alt="Logo" />
          IM-System
        </Link>
      </div>
      <div className="nav-element">
        {
          user && <button className="nav-button" onClick={toDashboard}>Dashboard</button>
        }
        {user ? (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="nav-button" onClick={handleLoginShow}>
            Login
          </button>
        )}
      </div>
    </div>
    {children}
    </>
  );
};

export default Navbar;
