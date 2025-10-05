import React, { useState } from 'react';
import { ArrowRight, BarChart3, Calendar, Dna, FlaskConical, Plus, Trash2, Download } from 'lucide-react';

const VisualizationPanel = ({
  selectedPapers = [],
  visualizations = [],
  onVisualizationCreate = () => {},
  onVisualizationDelete = () => {},
  onVisualizationDownload = () => {}
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const visualizationTypes = [
    { id: 'timeline', name: 'Timeline of Experiments', icon: Calendar },
    { id: 'organisms', name: 'Organisms Studied Chart', icon: Dna },
    { id: 'experiments', name: 'Types of Experiments', icon: FlaskConical },
  ];

  const mockVisualizations = [];

  const allVisualizations = visualizations?.length > 0 ? visualizations : mockVisualizations;

  const generateMockData = (type) => {
    // This is a simplified mock data generator. A real implementation would be more complex.
    switch (type) {
      case 'timeline':
        return { years: [2020, 2021, 2022], values: [5, 8, 12] };
      case 'organisms':
        return { categories: ['Plants', 'Microbes', 'Humans'], values: [10, 15, 8] };
      default:
        return { categories: ['A', 'B', 'C'], values: [3, 6, 9] };
    }
  };

  const handleCreateVisualization = (type) => {
    if (allVisualizations.length >= 6) return;
    const typeInfo = visualizationTypes.find(t => t.id === type);
    const newVisualization = {
      id: Date.now(),
      type: type,
      title: typeInfo.name,
      createdAt: new Date(),
      data: generateMockData(type), // Add mock data on creation
    };
    onVisualizationCreate(newVisualization);
    setIsCreating(false);
  };

  const renderVisualizationCard = (vis) => {
    const typeInfo = visualizationTypes.find(t => t.id === vis.type);
    const Icon = typeInfo ? typeInfo.icon : BarChart3;
    return (
      <div key={vis.id} className="bg-secondary/50 border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">{vis.title}</h4>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={() => onVisualizationDownload(vis)} className="p-1 rounded hover:bg-muted/50"><Download className="w-3 h-3 text-muted-foreground"/></button>
            <button onClick={() => onVisualizationDelete(vis.id)} className="p-1 rounded hover:bg-muted/50"><Trash2 className="w-3 h-3 text-red-500"/></button>
          </div>
        </div>
        <div className="h-24 bg-muted/30 rounded border-2 border-dashed border-muted/50 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Chart Area ({vis.data?.values?.length || 0} points)</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-transparent p-4 text-foreground">
      <div className="border-b border-border pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Visualizations</h2>
          <button
            onClick={() => setIsCreating(true)}
            disabled={allVisualizations.length >= 6 || selectedPapers.length === 0}
            className="flex items-center gap-1.5 bg-blue-600/50 text-white rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-blue-600/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Generate
          </button>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{allVisualizations.length} of 6 visualizations</span>
          <div className="w-24 bg-muted rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(allVisualizations.length / 6) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {isCreating ? (
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Choose a type:</h3>
          {visualizationTypes.map(type => (
            <button key={type.id} onClick={() => handleCreateVisualization(type.id)} className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary transition-colors text-left">
              <div className="flex items-center gap-2">
                <type.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{type.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
           <button onClick={() => setIsCreating(false)} className="text-sm text-muted-foreground hover:text-foreground mt-2">Cancel</button>
        </div>
      ) : allVisualizations.length > 0 ? (
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {allVisualizations.map(renderVisualizationCard)}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-input rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No visualization generated
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
            Generate a visualization based on the selected papers.
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
