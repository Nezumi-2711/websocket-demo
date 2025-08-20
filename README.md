# WebSocket Demo with Next.js

This project demonstrates real-time communication using WebSocket with a Next.js frontend and a standalone WebSocket server.

## Features

- Real-time messaging between multiple clients
- Connection status indicator
- Message history with timestamps
- Sender name customization
- Responsive design with Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page component
│   └── layout.tsx        # App layout
├── components/
│   └── WebSocketDemo.tsx # WebSocket client component
server/
└── websocket.js          # WebSocket server
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

### Running the Application

#### Option 1: Run both servers simultaneously (Recommended)
```bash
pnpm run dev:all
```

This will start:
- Next.js development server on http://localhost:3000
- WebSocket server on ws://localhost:8080

#### Option 2: Run servers separately

1. Start the WebSocket server:
```bash
pnpm run ws-server
```

2. In another terminal, start the Next.js development server:
```bash
pnpm run dev
```

### Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Enter your name (optional)
3. Click "Connect" to establish WebSocket connection
4. Start sending messages
5. Open multiple browser tabs/windows to test real-time messaging between clients

## WebSocket Server Details

The WebSocket server (`server/websocket.js`) provides:

- Connection management for multiple clients
- Message broadcasting to all connected clients
- Welcome messages for new connections
- Error handling and logging

### Message Format

Messages sent between client and server follow this JSON structure:

```json
{
  "type": "broadcast",
  "message": "Hello, World!",
  "sender": "John Doe",
  "timestamp": "2025-08-20T10:30:00.000Z"
}
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ws** - WebSocket library
- **WebSocket API** - Browser WebSocket implementation

## Development

### Scripts

- `pnpm run dev` - Start Next.js development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run ws-server` - Start WebSocket server
- `pnpm run dev:all` - Start both servers simultaneously
- `pnpm run lint` - Run ESLint

### Customization

You can customize the WebSocket server by modifying `server/websocket.js`:

- Change the port (default: 8080)
- Add authentication
- Implement different message types
- Add message persistence
- Implement rooms/channels

## Troubleshooting

### Connection Issues

If you can't connect to the WebSocket server:

1. Ensure the WebSocket server is running on port 8080
2. Check if the port is already in use by another application
3. Verify firewall settings allow connections on port 8080

### CORS Issues

If running in production, you may need to configure CORS settings for the WebSocket server.

## License

This project is open source and available under the [MIT License](LICENSE).
