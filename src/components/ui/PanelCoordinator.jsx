import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const PanelCoordinator = ({ 
  activePanel = 'search',
  onPanelChange = () => {},
  responsiveBreakpoint = 'desktop',
  panelStates = {
    search: 'expanded',
    chat: 'active', 
    visualizations: 'collapsed'
  },
  onPanelStateChange = () => {}
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(activePanel);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  const panels = [
    {
      id: 'search',
      label: 'Paper Search',
      icon: 'Search',
      description: 'Discover NASA datasets'
    },
    {
      id: 'chat',
      label: 'AI Analysis',
      icon: 'MessageSquare',
      description: 'Research assistant'
    },
    {
      id: 'visualizations',
      label: 'Visualizations',
      icon: 'BarChart3',
      description: 'Data insights'
    }
  ];

  const handlePanelSelect = (panelId) => {
    setCurrentPanel(panelId);
    onPanelChange(panelId);
  };

  const handlePanelExpand = (panelId) => {
    const newStates = { ...panelStates };
    
    // Toggle expansion state
    if (newStates?.[panelId] === 'expanded') {
      newStates[panelId] = 'active';
    } else {
      newStates[panelId] = 'expanded';
      // Collapse other panels when one expands
      Object.keys(newStates)?.forEach(key => {
        if (key !== panelId && newStates?.[key] === 'expanded') {
          newStates[key] = 'active';
        }
      });
    }
    
    onPanelStateChange(newStates);
  };

  const handlePanelCollapse = (panelId) => {
    const newStates = { ...panelStates };
    newStates[panelId] = newStates?.[panelId] === 'collapsed' ? 'active' : 'collapsed';
    onPanelStateChange(newStates);
  };

  // Mobile Tab Interface
  if (isMobile) {
    return (
      <div className="bg-card border-b border-border">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto">
          {panels?.map((panel) => (
            <button
              key={panel?.id}
              onClick={() => handlePanelSelect(panel?.id)}
              className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium scientific-transition border-b-2 ${
                currentPanel === panel?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-foreground hover:border-border'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name={panel?.icon} size={16} />
                <span className="truncate">{panel?.label}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Panel Status Indicators */}
        <div className="px-4 py-2 bg-muted/50">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Active: {panels?.find(p => p?.id === currentPanel)?.description}</span>
            <div className="flex items-center space-x-2">
              {Object.entries(panelStates)?.map(([panelId, state]) => (
                <div
                  key={panelId}
                  className={`w-2 h-2 rounded-full ${
                    state === 'expanded' ? 'bg-primary' :
                    state === 'active' ? 'bg-accent' : 'bg-muted-foreground'
                  }`}
                  title={`${panels?.find(p => p?.id === panelId)?.label}: ${state}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Panel Controls
  return (
    <div className="hidden md:flex items-center justify-between bg-card/50 border-b border-border px-6 py-2">
      {/* Panel State Indicators */}
      <div className="flex items-center space-x-6">
        {panels?.map((panel) => (
          <div key={panel?.id} className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Icon 
                name={panel?.icon} 
                size={14} 
                className={`${
                  panelStates?.[panel?.id] === 'expanded' ? 'text-primary' :
                  panelStates?.[panel?.id] === 'active' ? 'text-accent' : 'text-muted-foreground'
                }`}
              />
              <span className="text-xs text-text-secondary">{panel?.label}</span>
            </div>
            
            {/* Panel Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePanelExpand(panel?.id)}
                className="w-6 h-6"
                title={`${panelStates?.[panel?.id] === 'expanded' ? 'Collapse' : 'Expand'} ${panel?.label}`}
              >
                <Icon 
                  name={panelStates?.[panel?.id] === 'expanded' ? 'Minimize2' : 'Maximize2'} 
                  size={12} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePanelCollapse(panel?.id)}
                className="w-6 h-6"
                title={`${panelStates?.[panel?.id] === 'collapsed' ? 'Show' : 'Hide'} ${panel?.label}`}
              >
                <Icon 
                  name={panelStates?.[panel?.id] === 'collapsed' ? 'Eye' : 'EyeOff'} 
                  size={12} 
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Workspace Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="Layout"
          iconPosition="left"
          iconSize={14}
          onClick={() => {
            // Reset all panels to active state
            const resetStates = Object.keys(panelStates)?.reduce((acc, key) => {
              acc[key] = 'active';
              return acc;
            }, {});
            onPanelStateChange(resetStates);
          }}
        >
          Reset Layout
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Maximize"
          iconPosition="left"
          iconSize={14}
          onClick={() => {
            // Expand all panels
            const expandStates = Object.keys(panelStates)?.reduce((acc, key) => {
              acc[key] = 'expanded';
              return acc;
            }, {});
            onPanelStateChange(expandStates);
          }}
        >
          Expand All
        </Button>
      </div>
    </div>
  );
};

export default PanelCoordinator;