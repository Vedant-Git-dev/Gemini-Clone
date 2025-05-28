import React, { useState } from 'react'
import '../App.css'

function Chatwindow() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const sendMessage = async (message) => {
    const userMessage = { text: message, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message to server:', message); 
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data); 

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage = { text: data.response, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: `Server error: ${error.message}. Make sure Flask server is running on port 5000.`, 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleSubmit = () => {
    if (inputText && !isLoading) {
      sendMessage(inputText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-wrapper">
      {messages.length === 0 &&(
        <>
          <p className='intro'>Meet <span className='highlight'>Gemini</span>,</p>
          <p className='intro'>your personal AI assitance</p>
        </>
      ) }
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}>
            {message.text}
          </div>
        ))}
      </div>      
      

      <div className='input-container'>
        <div className='input'>
          <input 
            type="text" 
            className='text' 
            placeholder='Ask Gemini' 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <button 
            className='send' 
            onClick={handleSubmit}
            disabled={!inputText || isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatwindow