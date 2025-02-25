import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const API_URL =
    "https://chatbot-backend-peach.vercel.app" || "http://localhost:3000";

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot/ask`, {
        message: input,
      });
      setMessages([
        ...messages,
        newMessage,
        { role: "bot", content: response.data.response },
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        newMessage,
        { role: "bot", content: "Error al obtener respuesta." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 text-white p-5 rounded-lg shadow-lg flex flex-col h-[500px]">
      <h2 className="text-xl font-bold text-center mb-3">ChatBot AI</h2>
      <div
        className="flex-1 overflow-y-auto p-2 border border-gray-700 rounded-md"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 my-2 w-fit max-w-xs rounded-md text-sm ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-400 text-sm mt-2"
          >
            Escribiendo...
          </motion.div>
        )}
      </div>
      <div className="flex mt-3">
        <input
          className="flex-1 p-2 border rounded-l-md text-black"
          type="text"
          placeholder="Escribe tu mensaje"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 py-2 rounded-r-md text-white"
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
