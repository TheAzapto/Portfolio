from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from LLM_interface import rag_chain


chain = rag_chain



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

async def generate_response(query: str):
    for chunk in chain.stream({"input": query}):
        try:
            yield chunk["answer"]
        except KeyError:
            pass

@app.post("/chat")
async def chat(query: Query):
    return StreamingResponse(generate_response(query.query), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
