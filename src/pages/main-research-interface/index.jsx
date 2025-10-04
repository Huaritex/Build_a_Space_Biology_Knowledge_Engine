import React, { useState, useEffect } from 'react';
import WorkspaceHeader from '../../components/ui/WorkspaceHeader';
import SearchPanel from './components/SearchPanel';
import ChatPanel from './components/ChatPanel';
import VisualizationPanel from './components/VisualizationPanel';
import MobileTabNavigation from './components/MobileTabNavigation';

const MainResearchInterface = () => {
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [visualizations, setVisualizations] = useState([]);
  const [activePanel, setActivePanel] = useState('search');
  const [isMobile, setIsMobile] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('Space Biology Research Session');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = async (query, filters) => {
    setIsSearchLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 1500);
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsAiProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Based on your selected papers, I can provide insights about "${message}". The research shows interesting patterns in space biology studies, particularly regarding microgravity effects and cellular adaptations [1][2].

Key findings include:
- Altered gene expression patterns in space environments
- Changes in cellular structure and function
- Implications for long-duration space missions

Would you like me to elaborate on any specific aspect?`,
        timestamp: new Date(),
        citations: [1, 2]
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsAiProcessing(false);
    }, 2000);
  };

  const handleVisualizationCreate = (visualization) => {
    if (visualizations?.length < 6) {
      setVisualizations(prev => [...prev, visualization]);
    }
  };

  const handleVisualizationDelete = (visualizationId) => {
    setVisualizations(prev => prev?.filter(v => v?.id !== visualizationId));
  };

  const handleVisualizationDownload = (visualization) => {
    // Mock download functionality
    console.log('Downloading visualization:', visualization?.title);
  };

  const handleSessionSave = (title) => {
    setSessionTitle(title);
    // Mock save functionality
    console.log('Session saved:', title);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <WorkspaceHeader
        sessionTitle={sessionTitle}
        onSessionSave={handleSessionSave}
      />
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="mt-16">
          <MobileTabNavigation
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            selectedPapersCount={selectedPapers?.length}
            visualizationsCount={visualizations?.length}
          />
        </div>
      )}
      {/* Main Content */}
      <div className={`${isMobile ? 'mt-16' : 'mt-16'} h-[calc(100vh-4rem)]`}>
        {isMobile ? (
          // Mobile: Single Panel View
          (<div className="h-full">
            {activePanel === 'search' && (
              <SearchPanel
                selectedPapers={selectedPapers}
                onPaperSelectionChange={setSelectedPapers}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                isLoading={isSearchLoading}
                onSearch={handleSearch}
              />
            )}
            {activePanel === 'chat' && (
              <ChatPanel
                selectedPapers={selectedPapers}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isAiProcessing={isAiProcessing}
              />
            )}
            {activePanel === 'visualizations' && (
              <VisualizationPanel
                selectedPapers={selectedPapers}
                visualizations={visualizations}
                onVisualizationCreate={handleVisualizationCreate}
                onVisualizationDelete={handleVisualizationDelete}
                onVisualizationDownload={handleVisualizationDownload}
              />
            )}
          </div>)
        ) : (
          // Desktop: Three Panel Layout
          (<div className="h-full flex">
            {/* Left Panel - Search */}
            <div className="w-1/3 min-w-[320px] max-w-[400px]">
              <SearchPanel
                selectedPapers={selectedPapers}
                onPaperSelectionChange={setSelectedPapers}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                isLoading={isSearchLoading}
                onSearch={handleSearch}
              />
            </div>
            {/* Center Panel - Chat */}
            <div className="flex-1 min-w-[400px]">
              <ChatPanel
                selectedPapers={selectedPapers}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isAiProcessing={isAiProcessing}
              />
            </div>
            {/* Right Panel - Visualizations */}
            <div className="w-1/3 min-w-[320px] max-w-[400px]">
              <VisualizationPanel
                selectedPapers={selectedPapers}
                visualizations={visualizations}
                onVisualizationCreate={handleVisualizationCreate}
                onVisualizationDelete={handleVisualizationDelete}
                onVisualizationDownload={handleVisualizationDownload}
              />
            </div>
          </div>)
        )}
      </div>
    </div>
  );
};

export default MainResearchInterface;