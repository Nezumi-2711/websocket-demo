'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  type: string;
  message: string;
  sender?: string;
  timestamp: string;
}

export default function WebSocketDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('Connecting...');
    ws.current = new WebSocket('wss://fat-cobra-50.deno.dev');

    ws.current.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, data]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      console.log('Disconnected from WebSocket server');
    };

    ws.current.onerror = (error) => {
      setConnectionStatus('Error');
      console.error('WebSocket error:', error);
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN && inputMessage.trim()) {
      const message = {
        message: inputMessage,
        sender: senderName || 'Anonymous',
        timestamp: new Date().toISOString()
      };
      
      ws.current.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected':
        return 'text-green-600';
      case 'Connecting...':
        return 'text-yellow-600';
      case 'Error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">WebSocket Demo Updated</h1>
        <p className="text-gray-600">Real-time messaging with Next.js and WebSocket</p>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <span className={`font-semibold ${getStatusColor()}`}>
            Status: {connectionStatus}
          </span>
          <div className="space-x-2">
            <button
              onClick={connectWebSocket}
              disabled={isConnected}
              className={`px-4 py-2 rounded font-medium ${
                isConnected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Connect
            </button>
            <button
              onClick={disconnectWebSocket}
              disabled={!isConnected}
              className={`px-4 py-2 rounded font-medium ${
                !isConnected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Sender Name Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your name (optional)"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full p-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Messages Container */}
      <div className="mb-4 h-96 border border-gray-300 rounded-lg p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No messages yet. Connect to the WebSocket server and start chatting!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-blue-600">
                  {msg.sender || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-gray-800">{msg.message}</div>
              {msg.type === 'welcome' && (
                <div className="text-xs text-green-600 mt-1">Welcome message</div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          className={`flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            !isConnected ? 'bg-gray-100 cursor-not-allowed' : ''
          } text-black`}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          className={`px-6 py-3 rounded-lg font-medium ${
            !isConnected || !inputMessage.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Send
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Start the WebSocket server by running: <code className="bg-blue-100 px-1 rounded">node server/websocket.js</code></li>
          <li>2. Click &quot;Connect&quot; to establish WebSocket connection</li>
          <li>3. Enter your name (optional) and start sending messages</li>
          <li>4. Open multiple browser tabs to see real-time messaging between clients</li>
        </ol>
      </div>
    </div>
  );
}
