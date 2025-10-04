import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatPanel = ({
  selectedPapers = [],
  messages = [],
  onSendMessage = () => {},
  isAiProcessing = false
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock messages for demonstration
  const mockMessages = [
    {
      id: 1,
      type: 'ai',
      content: `Welcome to Space Biology Explorer! I'm your AI research assistant. I can help you analyze the selected papers and answer questions about space biology research. 

Currently, you have ${selectedPapers?.length} papers selected. Feel free to ask me anything about microgravity effects, radiation exposure, or space adaptation mechanisms.`,
      timestamp: new Date(Date.now() - 300000),
      citations: []
    },
    {
      id: 2,
      type: 'user',
      content: "What are the main effects of microgravity on plant cell development?",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'ai',
      content: `Based on the selected research papers, microgravity has several significant effects on plant cell development:

**Cell Wall Formation**: Studies show that microgravity conditions alter cellulose deposition patterns and lignification processes [1]. The absence of gravitational force affects how plant cells orient their growth and structural development.

**Cellular Organization**: Research indicates changes in organelle positioning and cytoskeletal organization under microgravity conditions [1][3]. This impacts normal cellular functions and metabolic processes.

**Gene Expression**: Multiple studies demonstrate altered gene expression patterns related to cell wall biosynthesis and structural proteins in microgravity environments [1].

These findings are crucial for understanding how plants might grow in space habitats and for developing agricultural systems for long-duration space missions.`,
      timestamp: new Date(Date.now() - 180000),
      citations: [1, 3]
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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCitation = (citationNumber) => {
    const paper = selectedPapers?.[citationNumber - 1];
    if (!paper) return `[${citationNumber}]`;
    
    return (
      <button
        key={citationNumber}
        className="inline-flex items-center px-1 py-0.5 bg-primary/20 text-primary text-xs rounded hover:bg-primary/30 scientific-transition"
        title={paper?.title}
        onClick={() => window.open(paper?.url, '_blank')}
      >[{citationNumber}]
              </button>
    );
  };

  const renderMessageContent = (content, citations = []) => {
    if (!citations?.length) return content;

    let formattedContent = content;
    citations?.forEach(citationNum => {
      const citationRegex = new RegExp(`\\[${citationNum}\\]`, 'g');
      formattedContent = formattedContent?.replace(
        citationRegex,
        `<citation-${citationNum}>`
      );
    });

    const parts = formattedContent?.split(/(<citation-\d+>)/);
    
    return parts?.map((part, index) => {
      const citationMatch = part?.match(/^<citation-(\d+)>$/);
      if (citationMatch) {
        const citationNum = parseInt(citationMatch?.[1]);
        return renderCitation(citationNum);
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="MessageSquare" size={20} className="text-primary" />
            <span>AI Research Assistant</span>
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {selectedPapers?.length} active papers
            </span>
            {isAiProcessing && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-primary">Processing...</span>
              </div>
            )}
          </div>
        </div>
        
        {selectedPapers?.length === 0 && (
          <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
            Select papers from the search panel to enable AI analysis
          </div>
        )}
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message?.type === 'ai' 
                  ? renderMessageContent(message?.content, message?.citations)
                  : message?.content
                }
              </div>
              <div className={`text-xs mt-2 opacity-70 ${
                message?.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTimestamp(message?.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isAiProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-text-secondary">AI is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Comienza a escribir..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e?.target?.value)}
            disabled={isAiProcessing || selectedPapers?.length === 0}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="default"
            disabled={!inputMessage?.trim() || isAiProcessing || selectedPapers?.length === 0}
            loading={isAiProcessing}
            iconName="Send"
            iconSize={16}
          >
            Send
          </Button>
        </form>
        
        {selectedPapers?.length > 0 && (
          <div className="mt-2 text-xs text-text-secondary">
            Ask questions about the {selectedPapers?.length} selected papers
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;