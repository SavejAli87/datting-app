import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:9092");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", message);
    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="bg-pink-500 text-white p-2 rounded-lg mb-2 w-fit">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex p-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-l"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}