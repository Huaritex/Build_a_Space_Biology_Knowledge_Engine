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
  const [synthesisResult, setSynthesisResult] = useState('');
  const [isSynthesisLoading, setIsSynthesisLoading] = useState(false);
  const [activePanel, setActivePanel] = useState('search');
  const [isMobile, setIsMobile] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('Space Biology Research Session');
  const [isCollapsed, setIsCollapsed] = useState(false); // State for mobile toggle

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

    try {
      // Build context from selected papers (use abstracts concatenated)
      const context = selectedPapers.map(p => `Title: ${p.title}\nAbstract: ${p.abstract}`).join('\n---\n');
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message, context })
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.answer || 'No answer',
        timestamp: new Date(),
        citations: []
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Lo siento, hubo un error al contactar a la IA.',
        timestamp: new Date(),
        citations: []
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSynthesize = async () => {
    if (!selectedPapers?.length) return;
    setIsAiProcessing(true);
    setIsSynthesisLoading(true);
    // Focus visualization panel for the user
    setActivePanel('visualizations');

    try {
      const SEPARATOR = '---FIN DEL PAPER---';
      const context = selectedPapers.map(p => `Título: ${p.title}\nAutores: ${(p.authors || []).join(', ')}\nAño: ${p.year}\nResumen: ${p.abstract}`).join(`\n${SEPARATOR}\n`);
      const instruction = `Eres una IA experta en análisis de investigación, construida sobre Gemini. Tu especialidad es leer papers científicos complejos de cualquier disciplina y destilar su contenido en un "Resumen Ejecutivo" claro y fácil de leer.

Tu única tarea es analizar el texto proporcionado y generar un Resumen Ejecutivo en texto plano, utilizando formato Markdown para los títulos y las viñetas. La respuesta debe ser únicamente el resumen, sin saludos, comentarios adicionales ni código JSON.

Genera la salida siguiendo ese formato y solo devuelve el resumen en Markdown.`;
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: instruction, context })
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      const resultText = data.answer || 'Sin respuesta';
      setSynthesisResult(resultText);
    } catch (err) {
      setSynthesisResult('Lo siento, hubo un error al realizar la síntesis con TESS.');
    } finally {
      setIsAiProcessing(false);
      setIsSynthesisLoading(false);
    }
  };

  const handleVisualizationCreate = (visualization) => {
    if (visualizations?.length < 6) {
      setVisualizations(prev => [...prev, visualization]);
    }
  };

  const handleVisualizationDelete = (visualizationId) => {
    setVisualizations(prev => prev.filter(v => v.id !== visualizationId));
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
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
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
          // Mobile: Single Panel View with collapse functionality
          !isCollapsed && (
            <div className="h-full p-2">
              {activePanel === 'search' && (
                <div className="bg-secondary rounded-lg border border-border h-full">
                  <SearchPanel
                    selectedPapers={selectedPapers}
                    onPaperSelectionChange={setSelectedPapers}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    isLoading={isSearchLoading}
                    onSearch={handleSearch}
                  />
                </div>
              )}
              {activePanel === 'chat' && (
                <div className="bg-secondary rounded-lg border border-border h-full">
                  <ChatPanel
                    selectedPapers={selectedPapers}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                onSynthesize={handleSynthesize}
                    isAiProcessing={isAiProcessing}
                  />
                </div>
              )}
              {activePanel === 'visualizations' && (
                <div className="bg-secondary rounded-lg border border-border h-full">
                  <VisualizationPanel
                    selectedPapers={selectedPapers}
                    visualizations={visualizations}
                    onVisualizationCreate={handleVisualizationCreate}
                    onVisualizationDelete={handleVisualizationDelete}
                    onVisualizationDownload={handleVisualizationDownload}
                  />
                </div>
              )}
            </div>
          )
        ) : (
          // Desktop: Three Panel Layout
          (<div className="h-full flex p-4 gap-4">
            <div className="w-[380px] bg-secondary rounded-lg border border-border">
              <SearchPanel
                selectedPapers={selectedPapers}
                onPaperSelectionChange={setSelectedPapers}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                isLoading={isSearchLoading}
                onSearch={handleSearch}
                onSynthesizeSelected={handleSynthesize}
              />
            </div>
            <div className="flex-1 bg-secondary rounded-lg border border-border">
              <ChatPanel
                selectedPapers={selectedPapers}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onSynthesize={handleSynthesize}
                isAiProcessing={isAiProcessing}
              />
            </div>
            <div className="w-[380px] bg-secondary rounded-lg border border-border">
              <VisualizationPanel synthesisResult={synthesisResult} isLoading={isSynthesisLoading} />
            </div>
          </div>)
        )}
      </div>
    </div>
  );
};

export default MainResearchInterface;
