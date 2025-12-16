import Navbar from "../components/Navbar";
import "../style/home.css";
import { FiCornerRightUp } from "react-icons/fi";

function Home() {
    return (
        <>
            <Navbar />
            <div className="content">
                <div className="Introduction">
                    <h1>Welcome to My Mind</h1>
                    <span style={{ display: "flex", justifyContent: "space-around" }}><p>To Get to know me better, You can ask me anything</p>
                        <p>just type your question in the box below</p></span>
                </div>
                <form action="">
                    <input id="textarea" type="text" placeholder="Type your question" />
                    <button id="send"><FiCornerRightUp /></button>
                </form>
            </div>
        </>
    )
}

export default Home