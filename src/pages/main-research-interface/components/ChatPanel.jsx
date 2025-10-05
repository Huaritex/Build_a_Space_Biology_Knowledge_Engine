import React, { useState, useRef, useEffect } from 'react';

// Placeholder for an avatar component. In a real app, you'd fetch user images.
const Avatar = ({ sender }) => (
  <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
    <span className="text-xs font-semibold text-foreground">
      {sender === 'TESS' ? 'AI' : 'ER'}
    </span>
  </div>
);

const ChatPanel = ({
  selectedPapers = [],
  messages = [],
  onSendMessage = () => {},
  isAiProcessing = false
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock messages updated to match the image
  const mockMessages = [
    {
      id: 1,
      type: 'ai',
      sender: 'TESS',
      content: 'Hello! How can I assist you with your space biology data exploration today?',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'user',
      sender: 'Usuario',
      content: "I'm looking for studies on the effects of microgravity on bone density in astronauts.",
      timestamp: new Date(),
    },
    {
      id: 3,
      type: 'ai',
      sender: 'TESS',
      content: "Certainly! According to Paper 3 [1], astronauts experience significant bone density loss during long-duration spaceflight due to the absence of gravitational forces. This study highlights the importance of countermeasures such as exercise and dietary supplements to mitigate these effects.",
      timestamp: new Date(),
      citations: [1], // From the text "Paper 3 [1]"
    }
  ];

  const allMessages = messages?.length > 0 ? messages : mockMessages;

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, isAiProcessing]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (inputMessage?.trim() && !isAiProcessing) {
      onSendMessage(inputMessage?.trim());
      setInputMessage('');
    }
  };

  const renderCitation = (citationNumber) => {
    const paper = selectedPapers?.[citationNumber - 1];
    const citationText = `[${citationNumber}]`;
    if (!paper) return citationText;
    
    return (
      <button
        key={citationNumber}
        className="inline-flex items-center px-1 py-0.5 bg-sky-500/20 text-sky-400 text-xs rounded hover:bg-sky-500/30 transition-colors"
        title={paper?.title}
        onClick={() => window.open(paper?.url, '_blank')}
      >{citationText}</button>
    );
  };

  const renderMessageContent = (content, citations = []) => {
    if (!citations?.length) return content;

    let formattedContent = content;
    // Create a regex to find all citation patterns like [1], [2], etc.
    const citationRegex = /\[(\d+)\]/g;
    
    const parts = formattedContent.split(citationRegex);

    return parts.map((part, index) => {
      // Even-indexed parts are text, odd-indexed parts are citation numbers
      if (index % 2 === 1) {
        const citationNum = parseInt(part);
        if (citations.includes(citationNum)) {
          return renderCitation(citationNum);
        } else {
          return `[${part}]`; // It's a number in brackets but not a valid citation
        }
      }
      return part;
    });
  };

  return (
    <div className="h-full flex flex-col bg-transparent p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Chat</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{selectedPapers.length} papers selected</span>
          {isAiProcessing && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Processing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {allMessages?.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.type === 'ai' && <Avatar sender={message.sender} />}
            <div
              className={`flex flex-col ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <p className="text-sm font-semibold text-foreground px-1">{message.sender}</p>
              <div
                className={`mt-1 rounded-lg p-3 max-w-md text-sm leading-relaxed whitespace-pre-wrap ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {renderMessageContent(message.content, message.citations)}
              </div>
            </div>
            {message.type === 'user' && <Avatar sender={message.sender} />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        <form onSubmit={handleSendMessage} className="border border-input rounded-lg p-1.5 flex items-center bg-secondary">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask a question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAiProcessing}
            className="flex-1 bg-transparent focus:outline-none text-foreground px-2"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAiProcessing}
            className="bg-blue-600 text-white rounded-md px-4 py-1.5 text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
