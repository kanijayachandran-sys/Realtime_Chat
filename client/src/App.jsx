// client/src/App.jsx
import { useEffect, useRef, useState } from "react";
import "./App.css";

const WS_URL = "ws://localhost:4000";

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Connect WebSocket once on mount
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "history") {
        // Initial history list
        setMessages(msg.payload || []);
      } else if (msg.type === "chat") {
        // New single chat message
        setMessages((prev) => [...prev, msg.payload]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!input.trim()) return;

    const payload = {
      type: "chat",
      text: input.trim(),
      author: username || "Anonymous"
    };

    socket.send(JSON.stringify(payload));
    setInput("");
  };

  const displayName = username || "Anonymous";

  // Step 1 screen: set username
  if (!ready) {
    return (
      <div className="page">
        <div className="card card-small">
          <h1 className="title">Join the Chat</h1>
          <p className="subtitle">
            Choose a display name to enter the room.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!username.trim()) return;
              setReady(true);
            }}
          >
            <label className="field-label">Display name</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kani_07"
              required
            />
            <button className="btn btn-primary full-width" type="submit">
              Enter chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2 screen: chat UI
  return (
    <div className="page">
      <div className="card chat-card">
        <header className="chat-header">
          <div>
            <h1 className="title">Realtime Chat</h1>
            <p className="subtitle">
              Connected as <strong>{displayName}</strong>
            </p>
          </div>
          <div className="chip">
            {socket && socket.readyState === WebSocket.OPEN
              ? "Online"
              : "Reconnecting..."}
          </div>
        </header>

        <main className="chat-body">
          <ul className="message-list">
            {messages.map((m) => {
              const mine = m.author === displayName;
              return (
                <li
                  key={m.id}
                  className={`message-row ${mine ? "mine" : "theirs"}`}
                >
                  <div className="avatar">
                    {m.author?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="bubble-group">
                    <div className="meta">
                      <span className="author">{mine ? "You" : m.author}</span>
                      <span className="time">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="bubble">{m.text}</div>
                  </div>
                </li>
              );
            })}
            <div ref={messagesEndRef} />
          </ul>
        </main>

        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            className="input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
