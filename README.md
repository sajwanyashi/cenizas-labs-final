This project is a chatbot that allows users to upload a PDF, ask questions about its content, and receive responses based on the document. It uses FastAPI for the backend and React.js for the frontend. The AI model is powered by Google Generative AI for embeddings and conversational responses.

🚀 Features
✅ Upload a PDF and extract its text
✅ Ask questions about the uploaded PDF
✅ Chatbot responds based on the document's content
✅ Prevents asking questions if no PDF is uploaded
✅ Automatically clears chat history when a new PDF is uploaded
✅ Smooth and modern UI with file upload and send message icons

🛠️ Tech Stack
Frontend (React.js)
Axios
HTML, CSS, JavaScript
Backend (FastAPI)
PyPDF2 (for extracting text from PDFs)
FAISS (for vector search)
Google Generative AI & LangChain (for embeddings and responses)
Python-dotenv (for environment variables)

📌 Installation Guide
🔹 1. Clone the Repository
git clone https://github.com/your-username/pdf-chatbot.git
cd pdf-chatbot
🔹 2. Set Up the Backend
📌 Create a Virtual Environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
📌 Install Dependencies
pip install -r requirements.txt
📌 Set Up API Keys
Create a .env file in the backend directory and add your Google API key:
GOOGLE_API_KEY=your_api_key_here
📌 Run the Backend Server
python3 uvicorn main:app --reload
The FastAPI server will start at:
📍 http://127.0.0.1:8000

🔹 3. Set Up the Frontend
📌 Install Dependencies
npm install
📌 Start the React App
npm rn dev

📌 Usage
1️⃣ Upload a PDF using the file upload icon 📂
2️⃣ Ask questions about the document
3️⃣ Receive responses based on the uploaded file
4️⃣ Uploading a new PDF clears chat history

📌 API Endpoints
Method	Endpoint	Description
POST	/upload/	Uploads and processes a PDF
POST	/query/	Queries the chatbot for answers


