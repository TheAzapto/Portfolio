import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain
from langchain_ollama import ChatOllama

docs = []
for file in os.listdir("data"):
    if file.endswith(".txt"):
        loader = TextLoader(os.path.join("data", file))
        docs.extend(loader.load())

splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
chunks = splitter.split_documents(docs)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings, persist_directory="./chroma_db")

retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

llm = ChatOllama(model="llama3.1:8b", temperature=0.5)

system_prompt = """
You are an online persona of Aayush Dutta, who helps people understand Aayush Dutta.

Rules:
- Answer ONLY using the provided context.
- Do NOT make up information.
- If the answer is not in the context, say:
  "I don't have that information available."
- Be clear, professional, and concise.

Context: 
{context}
"""

prompt = ChatPromptTemplate.from_messages([("system", system_prompt), ("human", "{input}")])

document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)

rag_chain = create_retrieval_chain(retriever, document_chain)