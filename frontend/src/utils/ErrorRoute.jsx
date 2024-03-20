import { Link } from "react-router-dom";
import "./Error.css";

const ErrorRoute = () => {
    return (
        <div className="error-handler">
            <h1>The Path You Are Seeking Never Existed...</h1>
            <h1>Error:404</h1>
            <h1>Page In Oblivion</h1>
            <Link to={"/"}>Want To Go Home?</Link>
        </div>
    );
};

export default ErrorRoute;