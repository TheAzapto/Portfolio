import Navbar from "../components/Navbar";
import "../style/chat.css";
import "../style/home.css";
import { FiCornerRightUp } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState("");
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, currentResponse]);

    const handleSend = async (e) => {
        e.preventDefault();

        const queryInput = document.getElementById("query");
        const query = queryInput.value.trim();

        if (!query) return;

        // Add user message to chat
        const userMessage = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);

        // Clear input
        queryInput.value = "";

        setIsLoading(true);
        setCurrentResponse("");

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                // Parse SSE format (data: content\n\n)
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const content = line.slice(6); // Remove 'data: ' prefix
                        fullResponse += content + " ";
                        setCurrentResponse(fullResponse);
                    }
                }
            }

            // Add bot response to chat history
            const botMessage = { role: "bot", content: fullResponse.trim() };
            setMessages((prev) => [...prev, botMessage]);
            setCurrentResponse("");

        } catch (error) {
            console.error("Error:", error);
            const errorMessage = {
                role: "bot",
                content: "Sorry, I encountered an error. Please try again."
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="content">
                <div className="Introduction">
                    <h1 style={{ textAlign: "center" }}>Welcome to My Mind</h1>
                    <span style={{ display: "flex", justifyContent: "space-around", maxWidth: "50vw", minWidth: "40vw" }}>
                        <p>To Get to know me better, You can ask me anything</p>
                        <p>Just type your question in the box below</p>
                        <p>AayushBot will try its best to answer your question</p>
                    </span>
                </div>

                <div
                    className="chat-container"
                    ref={chatContainerRef}
                    style={{
                        height: "50vh",
                        overflowY: "auto",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                    }}
                >
                    {messages.length === 0 && !isLoading && (
                        <div style={{
                            textAlign: "center",
                            color: "#888",
                            marginTop: "50px"
                        }}>
                            <p>Start a conversation by asking a question!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <div id={msg.role === "user" ? "user" : "bot"}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Show streaming response */}
                    {isLoading && (
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <div id="streaming">
                                {currentResponse || "Thinking..."}
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} style={{ marginTop: "20px" }}>
                    <div className='inputarea'>
                        <input
                            id="query"
                            type="text"
                            placeholder="Type your question"
                            disabled={isLoading}
                        />
                        <button id='send-button' type="submit" disabled={isLoading}>
                            <FiCornerRightUp />
                        </button>
                    </div>
                </form >
            </div >
        </>
    );
}

export default Chat;