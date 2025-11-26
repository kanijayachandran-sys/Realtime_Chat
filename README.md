# Realtime Chat Application

A realtime chat application built with React and a Node.js WebSocket server, featuring a responsive UI and shared message history across connected clients.

## Features

- Real-time messaging with WebSocket
- Responsive chat interface with message bubbles, avatars, and timestamps
- Shared message history loaded on client connect
- Simple username entry before chat
- Clear, modern UI/UX

## Technology Stack

- Frontend: React (built with Vite), modern CSS for styling
- Backend: Node.js with `ws` WebSocket library
- WebSocket protocol for full-duplex communication

## Folder Structure

realtime-chat/
server/
server.js # Node.js WebSocket backend server
package.json
client/
index.html
package.json
vite.config.js
src/
main.jsx
App.jsx # React chat application UI and websocket client
App.css # Styles for the chat UI

## Setup and Run

### Backend

cd realtime-chat/server
npm install
node server.js

The backend WebSocket server will listen on `ws://localhost:4000`.

### Frontend

cd realtime-chat/client
npm install
npm run dev

The frontend React app will run locally (usually on http://localhost:5173). Open in multiple tabs/browsers to test realtime messaging.

## Usage

1. Enter a display name
2. Send and receive messages in real time
3. Messages from all clients are visible with timestamps and author labels

## Contributing

Feel free to open issues or pull requests for improvements.

## License

This project is licensed under the MIT License.

---

Built by Kani
