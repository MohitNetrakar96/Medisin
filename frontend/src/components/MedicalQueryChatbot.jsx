import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ai_icon from '../assets/ai-icon.svg';

const MedicalChatbot = React.memo(() => {
  const { backendUrl, token } = useContext(AppContext);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What are the symptoms of flu?",
    "How can I reduce my blood pressure naturally?",
    "Is my headache a sign of something serious?",
    "What should I do for lower back pain?",
    "How can I improve my sleep quality?"
  ]);
  const [copySuccess, setCopySuccess] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Load saved messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('medisin-chat-messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error loading saved messages:", error);
      }
    }
  }, []);

  // Memoize suggestions
  const suggestionsMemo = useMemo(() => [
    "What are the symptoms of flu?",
    "How can I reduce my blood pressure naturally?",
    "Is my headache a sign of something serious?",
    "What should I do for lower back pain?",
    "How can I improve my sleep quality?"
  ], []);

  // Throttle localStorage writes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (messages.length > 0) {
        localStorage.setItem('medisin-chat-messages', JSON.stringify(messages));
      }
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [messages]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Optimize scroll behavior
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ''))
      .then(() => {
        setCopySuccess(text);
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const clearChat = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([]);
      localStorage.removeItem('medisin-chat-messages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: prompt,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/medical/medical-query`,
        { prompt: userMessage.text },
        { headers: { token } }
      );

      // Add bot response to chat
      if (res.data.success) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: Date.now(),
            text: res.data.response,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        // Generate new suggestions based on the conversation context
        generateNewSuggestions();
      } else {
        // Add error message as bot response
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: Date.now(),
            text: res.data.message || "I'm sorry, I couldn't process your request.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true
          }
        ]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "I'm sorry, I couldn't connect to the server. Please check your connection.";

      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now(),
          text: `Error: ${errorMessage}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewSuggestions = () => {
    // This would ideally be based on conversation context or server response
    const allSuggestions = [
      "What are the symptoms of flu?",
      "How can I reduce my blood pressure naturally?",
      "Is my headache a sign of something serious?",
      "What should I do for lower back pain?",
      "How can I improve my sleep quality?",
      "What foods help boost immunity?",
      "How much exercise do I need daily?",
      "What are the signs of vitamin D deficiency?",
      "Is intermittent fasting healthy?",
      "How to manage stress and anxiety?"
    ];

    // Select 3-4 random suggestions that aren't currently displayed
    // Limit to 4 for mobile, more for larger screens
    const suggestionsCount = window.innerWidth < 768 ? 3 : 5;
    const newSuggestions = allSuggestions
      .filter(s => !suggestions.includes(s))
      .sort(() => 0.5 - Math.random())
      .slice(0, suggestionsCount);

    setSuggestions(newSuggestions);
  };

  const applySuggestion = (text) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Format message text with markdown-like syntax
  const formatMessageText = (text) => {
    // Replace **text** with bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // Replace *text* with italic
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Replace # Heading with h3
    text = text.replace(/^# (.*?)$/gm, '<h3 class="text-xl font-bold my-2 text-blue-800">$1</h3>');

    // Replace ## Heading with h4
    text = text.replace(/^## (.*?)$/gm, '<h4 class="text-lg font-semibold my-2 text-blue-700">$1</h4>');

    // Replace bullet points
    text = text.replace(/^- (.*?)$/gm, '<li class="mb-1">$1</li>');

    // Add list tags around consecutive list items
    text = text.replace(/(<li.*?<\/li>\n)+/g, '<ul class="pl-6 my-2 list-disc">$&</ul>');

    // Replace line breaks with br tags
    text = text.replace(/\n/g, '<br>');

    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[600px] sm:w-full lg:w-screen max-w-[120vh] mx-auto rounded-lg overflow-hidden flex flex-col bg-white border shadow-md"
    >
      {/* Enhanced Header with new color scheme and animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-b z-10 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md"
            animate={{
              boxShadow: ['0px 0px 8px rgba(255,255,255,0.5)', '0px 0px 16px rgba(255,255,255,0.8)', '0px 0px 8px rgba(255,255,255,0.5)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.img
              src={ai_icon}
              alt="AI Assistant"
              loading="lazy"
              className="w-full h-full"
              width="40"
              height="40"
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <div className="flex-1">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold flex items-center"
            >
              <span className="mr-2">Medisin AI</span>

            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-indigo-100"
            >
              Your Personal Health Assistant
            </motion.p>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="bg-indigo-800 p-2 rounded-full cursor-pointer shadow-sm flex items-center justify-center"
            title="Clear chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Chat area - With properly implemented scrolling */}
      <div
        ref={chatContainerRef}
        className="pt-5 flex-1 overflow-y-auto p-3 space-y-3 pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </motion.svg>
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-medium text-xl text-indigo-700"
            >
              Welcome to MEDISIN
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-md mx-auto mt-2 mb-6 text-sm px-4"
            >
              I'm your personal health assistant. Ask me anything about health and wellness!
            </motion.p>

            {/* Suggestions in a row on medium+ screens */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-lg px-4"
            >
              {suggestions.slice(0, window.innerWidth < 768 ? 3 : suggestions.length).map((text, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, backgroundColor: '#EEF2FF' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.6 + index * 0.1 }
                  }}
                  onClick={() => applySuggestion(text)}
                  className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 cursor-pointer text-left text-sm text-gray-700 hover:text-indigo-800"
                >
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index > messages.length - 2 ? 0.1 : 0
                }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`max-w-[85%] sm:max-w-[75%] text-sm sm:text-base rounded-2xl p-3.5 relative ${message.sender === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : message.isError
                      ? 'bg-red-100 text-red-800 rounded-bl-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center">
                        <motion.img
                          src={ai_icon}
                          alt="AI Assistant"
                          loading="lazy"
                          className="w-full h-full"
                          width="40"
                          height="40"
                          animate={{
                            rotate: [0, 30, 0, -90, 0],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                      <p className="text-sm font-semibold">Medisin AI</p>
                      <div className="bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded-full">
                        Verified
                      </div>

                      {/* Copy button for bot messages */}
                      {message.sender === 'bot' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopyText(message.text)}
                          className="ml-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-sm text-xs flex items-center justify-center"
                          title="Copy response"
                        >
                          {copySuccess === message.text ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                        </motion.button>
                      )}
                    </div>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                    className="message-content text-sm sm:text-base leading-relaxed"
                  />
                  <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </div>
                </motion.div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-3.5 max-w-[85%] sm:max-w-[75%]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <motion.img
                        src={ai_icon}
                        alt="AI Assistant"
                        loading="lazy"
                        className="w-full h-full"
                        width="40"
                        height="40"
                        animate={{
                          rotate: [0, 360], // Full 360-degree rotation
                        }}
                        transition={{
                          duration: 0.5, // Reduce duration for faster rotation
                          repeat: Infinity, // Infinite rotation
                          ease: "linear" // Ensures constant speed
                        }}    
                      />
                    </div>
                    <p className="text-xs font-medium">Medisin AI</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggestions in row for medium+ screens */}
            {messages.length > 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 justify-center my-4"
              >
                <div className="w-full sm:w-auto flex flex-wrap sm:flex-row gap-2 justify-center">
                  {suggestions.slice(0, window.innerWidth < 768 ? 3 : suggestions.length).map((text, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, backgroundColor: '#EEF2FF' }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3 + index * 0.1 }
                      }}
                      onClick={() => applySuggestion(text)}
                      className="bg-white py-2 px-4 rounded-full shadow-sm border border-gray-200 cursor-pointer text-sm text-gray-700 hover:text-indigo-600 max-w-full sm:max-w-[200px] truncate"
                    >
                      {text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="p-2 bg-white border-t mt-auto"
      >
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask me about your health concerns..."
            disabled={loading}
            className="w-full pl-4 pr-14 py-3.5 text-sm sm:text-base rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            style={{ minHeight: '45px', maxHeight: '100px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`absolute right-2 p-2.5 rounded-full ${loading || !prompt.trim() ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white'
              } transition-all shadow-sm`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </motion.form>
    </motion.div>
  );
});

export default MedicalChatbot;
