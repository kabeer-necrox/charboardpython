import React, { useState } from 'react';
import axios from 'axios';

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false); // To toggle chat box visibility
  const [message, setMessage] = useState(''); // To hold the message content
  const [responses, setResponses] = useState([]); // To store chat messages

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    // Add user message to chat
    setResponses((prev) => [...prev, { sender: "user", text: message }]);

    try {
      // Send the message to the backend
      const response = await axios.post('http://127.0.0.1:5000/api/search', { query: message });
      const reply = response.data[0]?.content || "No response found.";

      // Add bot response to chat
      setResponses((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setResponses((prev) => [...prev, { sender: "bot", text: "Error connecting to the server." }]);
    }

    setMessage(''); // Clear the text box
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      {/* Message Icon */}
      <div
        onClick={toggleChatBox}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#0084ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/60/60525.png"
          alt="Message Icon"
          style={{ width: '25px', height: '25px', filter: 'invert(1)' }}
        />
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div
          style={{
            width: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
            padding: '15px',
            marginTop: '10px',
            position: 'relative',
          }}
        >
          {/* Chat Messages */}
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              marginBottom: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            {responses.map((res, index) => (
              <div
                key={index}
                style={{
                  textAlign: res.sender === 'user' ? 'right' : 'left',
                  margin: '5px 0',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '10px',
                    borderRadius: '10px',
                    background: res.sender === 'user' ? '#0084ff' : '#e5e5ea',
                    color: res.sender === 'user' ? '#fff' : '#000',
                  }}
                >
                  {res.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              width: '100%',
              height: '60px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0084ff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
