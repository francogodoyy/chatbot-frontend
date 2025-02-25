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
    <div className="max-w-lg mx-auto bg-gray-900 text-white p-5 rounded-xl shadow-2xl flex flex-col h-[550px]">
      {/* Título */}
      <h2 className="text-2xl font-semibold text-center mb-4">ChatBot AI 🤖</h2>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-3 border border-gray-700 rounded-lg space-y-2">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 my-1 max-w-xs rounded-2xl text-sm shadow-md ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-purple-600 text-white"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}

        {/* Indicador de Carga */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-400 text-sm mt-2 animate-pulse"
          >
            Escribiendo...
          </motion.div>
        )}
      </div>

      {/* Input y Botón */}
      <div className="flex mt-3">
        <input
          className="flex-1 p-2 border border-gray-700 rounded-l-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-r-lg text-white font-semibold transition hover:opacity-80 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
