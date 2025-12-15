import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
    const [menuClass, setMenuClass] = useState("menu hidden");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setBurgerClass(isMenuOpen ? "burger-bar clicked" : "burger-bar unclicked");
        setMenuClass(isMenuOpen ? "menu visible" : "menu hidden");
    };

    return (
        <div className="navbar">
            <div className="logo">Aayush Dutta</div>
            <nav>
                <div className="burger-menu" onClick={toggleMenu}>
                    <span className={burgerClass}></span>
                    <span className={burgerClass}></span>
                    <span className={burgerClass}></span>
                </div>
            </nav>
            <div className={menuClass}>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/project')}>Project</li>
                    <li onClick={() => navigate('/contact')}>Contact</li>
                </ul>
                <div className="holder"></div>
            </div>
        </div>
    )
}

export default Navbar;