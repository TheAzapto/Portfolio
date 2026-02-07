import Navbar from "../components/Navbar";
import "../style/chat.css";
import React, { useState, useRef, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState("");
    const chatContainerRef = useRef(null);

    // Auto-scroll logic
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

        // Optimistic UI update
        const userMessage = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        queryInput.value = "";

        setIsLoading(true);
        setCurrentResponse("");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const content = line.slice(6);
                        fullResponse += content + " ";
                        setCurrentResponse(fullResponse);
                    }
                }
            }

            setMessages((prev) => [...prev, { role: "bot", content: fullResponse.trim() }]);
            setCurrentResponse("");

        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please check the backend connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-wrapper">
            <Navbar />

            <div className="chat-container" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="chat-intro">
                        <h1>How can I help you?</h1>
                        <p>Ask me anything about my work, skills, or experience.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {/* Streaming message bubble */}
                        {isLoading && (
                            <div className="message bot">
                                <div className="message-bubble typing">
                                    {currentResponse || "Thinking..."}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="input-area-wrapper">
                <form className="input-container" onSubmit={handleSend}>
                    <input
                        id="query"
                        type="text"
                        placeholder="Ask anything..."
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    <button type="submit" className="send-btn" disabled={isLoading}>
                        <FiArrowUp />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;