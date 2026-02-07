from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_classic.chains import RetrievalQA
from langchain_classic.prompts import PromptTemplate
import asyncio
from typing import AsyncGenerator

app = FastAPI(title="Personal Chatbot API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to your React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
PERSIST_DIRECTORY = "./chroma_db"
OLLAMA_MODEL = "llama3.1:8b"

embeddings = OllamaEmbeddings(model=OLLAMA_MODEL, base_url="http://127.0.0.1:11434")
vectorstore = Chroma(
    persist_directory=PERSIST_DIRECTORY,
    embedding_function=embeddings
)
llm = OllamaLLM(model=OLLAMA_MODEL, base_url="http://127.0.0.1:11434")

# Custom prompt template
template = """You are a personal AI assistant representing the person whose information is in the context below. 
Answer questions as if you are this person, using first person perspective. Be conversational and natural. avoid asking questions.
If you don't know something based on the context, politely say so.

Context: {context}

Question: {question}

Answer:"""

PROMPT = PromptTemplate(
    template=template,
    input_variables=["context", "question"]
)

# Create retrieval chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    chain_type_kwargs={"prompt": PROMPT}
)

class ChatRequest(BaseModel):
    query: str

async def generate_response(query: str) -> AsyncGenerator[str, None]:
    """Generate streaming response from the RAG chain"""
    try:
        # Run the chain in a thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, qa_chain.invoke, {"query": query})
        
        # Stream the response word by word for better UX
        result_text = response.get("result", "")
        words = result_text.split()
        
        for word in words:
            yield f"data: {word}\n\n"
            await asyncio.sleep(0.05)  # Small delay for streaming effect
            
    except Exception as e:
        print(e)
        yield f"data: [Error: {str(e)}]\n\n"

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat endpoint with SSE streaming"""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    print('api called')
    return StreamingResponse(
        generate_response(request.query),
        media_type="text/event-stream"
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check if vectorstore has documents
        doc_count = vectorstore._collection.count()
        return {
            "status": "healthy",
            "documents_loaded": doc_count,
            "model": OLLAMA_MODEL
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)