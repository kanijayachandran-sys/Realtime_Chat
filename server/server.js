// server/server.js
const WebSocket = require("ws");
const PORT = 4000;

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

// Connected clients + in‑memory history
const clients = new Set();
const messageHistory = [];

console.log(`WebSocket server running at ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client connected. Total:", clients.size);

  // Send existing history to this client
  ws.send(
    JSON.stringify({
      type: "history",
      payload: messageHistory
    })
  );

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === "chat") {
        const chatMessage = {
          id: Date.now() + Math.random(),
          text: data.text || "",
          author: data.author || "Anonymous",
          timestamp: new Date().toISOString()
        };

        // Save to history (RAM only)
        messageHistory.push(chatMessage);

        const out = JSON.stringify({
          type: "chat",
          payload: chatMessage
        });

        // Broadcast to every connected client
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(out);
          }
        }
      }
    } catch (err) {
      console.error("Invalid message from client:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected. Total:", clients.size);
  });
});
