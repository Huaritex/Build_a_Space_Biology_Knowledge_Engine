import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VisualizationPanel = ({
  selectedPapers = [],
  visualizations = [],
  onVisualizationCreate = () => {},
  onVisualizationDelete = () => {},
  onVisualizationDownload = () => {}
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const visualizationTypes = [
    { id: 'timeline', name: 'Timeline of Experiments', icon: 'Calendar', description: 'Chronological view of research studies' },
    { id: 'organisms', name: 'Organisms Studied Chart', icon: 'Dna', description: 'Distribution of studied organisms' },
    { id: 'experiments', name: 'Types of Experiments', icon: 'FlaskConical', description: 'Categorization of experiment types' },
    { id: 'connections', name: 'Connection Map', icon: 'Network', description: 'Research collaboration network' },
    { id: 'statistics', name: 'General Statistics', icon: 'BarChart3', description: 'Overall research metrics' },
    { id: 'custom', name: 'Custom Visualization', icon: 'Settings', description: 'Create custom charts' }
  ];

  // Mock visualizations for demonstration
  const mockVisualizations = [
    {
      id: 1,
      type: 'timeline',
      title: 'Timeline of Experiments',
      createdAt: new Date(Date.now() - 3600000),
      data: {
        years: ['2019', '2020', '2021', '2022', '2023'],
        values: [5, 8, 12, 15, 18]
      }
    },
    {
      id: 2,
      type: 'organisms',
      title: 'Organisms Studied Chart',
      createdAt: new Date(Date.now() - 1800000),
      data: {
        categories: ['Plants', 'Microbes', 'Human Cells', 'Animals'],
        values: [12, 8, 15, 6]
      }
    }
  ];

  const allVisualizations = visualizations?.length > 0 ? visualizations : mockVisualizations;

  const handleCreateVisualization = (type) => {
    if (allVisualizations?.length >= 6) return;

    const typeInfo = visualizationTypes?.find(t => t?.id === type);
    const newVisualization = {
      id: Date.now(),
      type: type,
      title: typeInfo?.name,
      createdAt: new Date(),
      data: generateMockData(type)
    };

    onVisualizationCreate(newVisualization);
    setIsCreating(false);
  };

  const generateMockData = (type) => {
    switch (type) {
      case 'timeline':
        return {
          years: ['2019', '2020', '2021', '2022', '2023'],
          values: [5, 8, 12, 15, 18]
        };
      case 'organisms':
        return {
          categories: ['Plants', 'Microbes', 'Human Cells', 'Animals'],
          values: [12, 8, 15, 6]
        };
      case 'experiments':
        return {
          types: ['Microgravity', 'Radiation', 'Cell Biology', 'Plant Studies'],
          values: [20, 15, 18, 12]
        };
      case 'connections':
        return {
          nodes: ['NASA', 'ESA', 'JAXA', 'Universities'],
          connections: 25
        };
      case 'statistics':
        return {
          metrics: ['Total Papers', 'Citations', 'Authors', 'Institutions'],
          values: [156, 2340, 89, 23]
        };
      default:
        return {
          categories: ['Category A', 'Category B', 'Category C'],
          values: [10, 15, 8]
        };
    }
  };

  const handleDownload = (visualization) => {
    // Mock download functionality
    onVisualizationDownload(visualization);
  };

  const renderVisualizationCard = (visualization) => {
    const typeInfo = visualizationTypes?.find(t => t?.id === visualization?.type);
    
    return (
      <div
        key={visualization?.id}
        className="bg-card border border-border rounded-lg scientific-shadow micro-interaction hover:shadow-scientific-lg"
      >
        {/* Card Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={typeInfo?.icon || 'BarChart3'} size={16} className="text-primary" />
              <h3 className="font-medium text-card-foreground text-sm truncate">
                {visualization?.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(visualization)}
                className="w-6 h-6"
                title="Download Chart"
              >
                <Icon name="Download" size={12} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVisualizationDelete(visualization?.id)}
                className="w-6 h-6 text-destructive hover:text-destructive"
                title="Delete Chart"
              >
                <Icon name="Trash2" size={12} />
              </Button>
            </div>
          </div>
          
          <div className="mt-1">
            <span className="text-xs text-text-secondary">
              Created {new Date(visualization.createdAt)?.toLocaleDateString()}
            </span>
          </div>
        </div>
        {/* Mock Chart Area */}
        <div className="p-4">
          <div className="h-32 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <Icon name={typeInfo?.icon || 'BarChart3'} size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-text-secondary">
                {typeInfo?.name || 'Visualization'}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {visualization?.data?.values?.length || visualization?.data?.categories?.length || 0} data points
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <span>Visualizations</span>
          </h2>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreating(true)}
            disabled={allVisualizations?.length >= 6 || selectedPapers?.length === 0}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Generate Visualization
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">
            {allVisualizations?.length} of 6 visualizations
          </span>
          <span className="text-text-secondary">
            {selectedPapers?.length} papers selected
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-muted rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full scientific-transition"
            style={{ width: `${(allVisualizations?.length / 6) * 100}%` }}
          />
        </div>

        {selectedPapers?.length === 0 && (
          <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
            Select papers to enable visualization generation
          </div>
        )}
      </div>
      {/* Create Visualization Modal */}
      {isCreating && (
        <div className="p-4 border-b border-border bg-accent/5">
          <h3 className="font-medium text-card-foreground mb-3">Choose Visualization Type</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visualizationTypes?.map((type) => (
              <button
                key={type?.id}
                onClick={() => handleCreateVisualization(type?.id)}
                className="p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 scientific-transition"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name={type?.icon} size={16} className="text-primary" />
                  <span className="font-medium text-sm text-card-foreground">{type?.name}</span>
                </div>
                <p className="text-xs text-text-secondary">{type?.description}</p>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Visualizations Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {allVisualizations?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allVisualizations?.map(renderVisualizationCard)}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No Visualizations Yet
              </h3>
              <p className="text-text-secondary mb-4">
                Select papers from the search panel and generate your first visualization to analyze research trends and patterns.
              </p>
              {selectedPapers?.length === 0 && (
                <p className="text-sm text-warning">
                  Select papers first to enable visualization creation.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;