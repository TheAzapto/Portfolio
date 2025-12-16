import { useState } from "react"


function Test() {
    const [content, setContent] = useState("")
    const [answer, setAnswer] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        setIsLoading(true)
        setAnswer("Thinking...")
        try {
            const query = document.getElementById("query").value
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            })

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            setAnswer("")

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                console.log(chunk)
                setAnswer((prev) => prev + chunk);
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }

    }

    return (
        <div>
            <p id="content">{answer}</p>
            <input type="text" id="query" />
            <button onClick={handleSend}>Send</button>
        </div >
    )
}

export default Test