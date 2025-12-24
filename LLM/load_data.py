import os
from langchain_community.document_loaders import TextLoader
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# Configuration
DATA_FOLDER = "./data"
PERSIST_DIRECTORY = "./chroma_db"
OLLAMA_MODEL = "llama3.1:8b"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

def load_documents():
    """Load all text files from the data folder"""
    documents = []
    
    if not os.path.exists(DATA_FOLDER):
        print(f"Creating {DATA_FOLDER} folder...")
        os.makedirs(DATA_FOLDER)
        print(f"Please add your text files to the {DATA_FOLDER} folder and run this script again.")
        return documents
    
    txt_files = [f for f in os.listdir(DATA_FOLDER) if f.endswith('.txt')]
    
    if not txt_files:
        print(f"No .txt files found in {DATA_FOLDER} folder.")
        return documents
    
    print(f"Found {len(txt_files)} text file(s)")
    
    for filename in txt_files:
        file_path = os.path.join(DATA_FOLDER, filename)
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            docs = loader.load()
            documents.extend(docs)
            print(f"✓ Loaded: {filename}")
        except Exception as e:
            print(f"✗ Error loading {filename}: {str(e)}")
    
    return documents

def split_documents(documents):
    """Split documents into chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    return chunks

def create_or_update_vectorstore(chunks):
    """Create or update the ChromaDB vector store"""
    print("Initializing embeddings...")
    embeddings = OllamaEmbeddings(model=OLLAMA_MODEL)
    
    if os.path.exists(PERSIST_DIRECTORY):
        print("Updating existing vector store...")
        # Load existing vectorstore
        vectorstore = Chroma(
            persist_directory=PERSIST_DIRECTORY,
            embedding_function=embeddings
        )
        # Add new documents
        vectorstore.add_documents(chunks)
    else:
        print("Creating new vector store...")
        # Create new vectorstore
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=PERSIST_DIRECTORY
        )
    
    print(f"Vector store saved to {PERSIST_DIRECTORY}")
    return vectorstore

def clear_vectorstore():
    """Clear the entire vector store (use with caution)"""
    if os.path.exists(PERSIST_DIRECTORY):
        import shutil
        shutil.rmtree(PERSIST_DIRECTORY)
        print(f"Cleared vector store at {PERSIST_DIRECTORY}")
    else:
        print("No vector store to clear")

def main():
    print("=" * 50)
    print("Personal Chatbot - Document Loader")
    print("=" * 50)
    print()
    print("Options:")
    print("1. Load/Update documents")
    print("2. Clear vector store and reload")
    print("3. Exit")
    print()
    
    choice = input("Enter your choice (1-3): ").strip()
    
    if choice == "1":
        print("\nLoading documents...")
        documents = load_documents()
        
        if not documents:
            return
        
        chunks = split_documents(documents)
        vectorstore = create_or_update_vectorstore(chunks)
        
        print("\n✓ Done! Your chatbot is ready to use.")
        print(f"Total documents in vector store: {vectorstore._collection.count()}")
        
    elif choice == "2":
        confirm = input("Are you sure you want to clear all data? (yes/no): ").strip().lower()
        if confirm == "yes":
            clear_vectorstore()
            print("\nReloading documents...")
            documents = load_documents()
            
            if not documents:
                return
            
            chunks = split_documents(documents)
            vectorstore = create_or_update_vectorstore(chunks)
            
            print("\n✓ Done! Vector store rebuilt.")
            print(f"Total documents: {vectorstore._collection.count()}")
        else:
            print("Operation cancelled")
    
    elif choice == "3":
        print("Exiting...")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()