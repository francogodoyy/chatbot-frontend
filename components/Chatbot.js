import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://chatbot-backend-peach.vercel.app" || "http://localhost:3000";

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
    <div className="max-w-lg mx-auto bg-gray-900 text-white p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-3">ChatBot AI</h2>
      <div className="h-64 overlflow-y-auto p-2 border border-gray-700 rounded-mb mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
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
