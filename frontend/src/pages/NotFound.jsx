import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div className="wrapper content">
                <h1 style={{ fontSize: "5rem", fontWeight: "bold", marginBottom: "0rem" }}>404 Not Found</h1>
                <p style={{ fontSize: "1.2rem", marginBottom: "0", marginTop: "1rem" }}>Oops! Looks Like you like you are lost.</p>
                <p style={{ fontSize: "1.2rem", marginBottom: "2rem", marginTop: "0" }}>exploration can be fun, but not here.</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        </>
    )
}

export default NotFound