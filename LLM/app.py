from fastapi import FastAPI
from pydantic import BaseModel
from LLM_interface import rag_chain


chain = rag_chain

app = FastAPI()

class Query(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat")
async def chat(query: Query):
    response = await chain.invoke({"input": query.query})
    return {"answer": response["answer"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
