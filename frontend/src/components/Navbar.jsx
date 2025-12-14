import { useNavigate } from "react-router-dom";
import "../style/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <ul>
                <li onClick={() => navigate('/')}>Home</li>
                <li className="has-submenu">Projects
                    <ul className="submenu">
                        <li onClick={() => navigate('/project/1')}>Project 1</li>
                        <li onClick={() => navigate('/project/2')}>Project 2</li>
                        <li onClick={() => navigate('/project/2')}>Project 2</li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default Navbar;