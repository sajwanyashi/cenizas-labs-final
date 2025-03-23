from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import google.generativeai as genai
import os
from dotenv import load_dotenv
import shutil

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_embeddings(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectors = FAISS.from_texts(chunks, embedding=embeddings)
    vectors.save_local("faiss_index")

def get_conversational_chain():
    prompt = PromptTemplate(
        template="Context:\n{context}\n\nQuestion:\n{question}\n",
        input_variables=["context", "question"],
    )
    model = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.5)
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_reader = PdfReader(file.file)
    text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
    chunks = get_text_chunks(text)
    get_embeddings(chunks)
    return {"message": "PDF processed successfully"}

@app.post("/query/")
async def query_pdf(question: str = Form(...)):
    embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embedding, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    return {"answer": response["output_text"]}