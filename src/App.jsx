import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./style.css"; // Ensure this file includes the chat styling

function ChatApp() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // Scroll chat to bottom when chatHistory updates
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);

  // Reset chat history when a new file is uploaded
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setChatHistory([]); // Clear chat history
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:8000/upload/", formData);
      alert("PDF uploaded successfully!");
      setChatHistory([]); // Clear chat history after successful upload
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleQuery = async () => {
    if (!file) return alert("Please upload a PDF first!"); // Prevents question submission if no PDF is uploaded
    if (!question) return alert("Please enter a question");
  
    const newUserMessage = { type: "user", text: question };
    setChatHistory([...chatHistory, newUserMessage]);
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/query/",
        new URLSearchParams({ question })
      );
  
      const newBotMessage = { type: "bot", text: res.data.answer };
      setChatHistory((prevChat) => [...prevChat, newBotMessage]);
      setQuestion(""); // Clear input after asking
    } catch (error) {
      console.error("Query failed", error);
    }
  };  

  return (
    <div className="gradient-bg">
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container">
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>
        <div className="interactive"></div>
      </div>

      <div className="chat-container">
        <h1>PDF Chatbot</h1>

        <div className="upload-section">
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload PDF</button>
        </div>

        <div className="chat-box" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="query-section">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
          />
          <button onClick={handleQuery}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
