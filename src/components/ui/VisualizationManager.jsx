import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const VisualizationManager = ({
  activeVisualizations = [],
  onVisualizationCreate = () => {},
  onVisualizationDelete = () => {},
  onVisualizationDownload = () => {},
  selectedPapers = [],
  maxVisualizations = 6
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newVisualization, setNewVisualization] = useState({
    type: 'bar',
    dataSource: 'papers',
    title: '',
    parameters: {}
  });
  const downloadRef = useRef();

  const visualizationTypes = [
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { value: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { value: 'scatter', label: 'Scatter Plot', icon: 'Scatter' },
    { value: 'pie', label: 'Pie Chart', icon: 'PieChart' },
    { value: 'heatmap', label: 'Heat Map', icon: 'Grid3X3' },
    { value: 'network', label: 'Network Graph', icon: 'Network' }
  ];

  const dataSourceOptions = [
    { value: 'papers', label: 'Selected Papers' },
    { value: 'keywords', label: 'Keyword Analysis' },
    { value: 'authors', label: 'Author Collaboration' },
    { value: 'timeline', label: 'Publication Timeline' },
    { value: 'citations', label: 'Citation Network' }
  ];

  const handleCreateVisualization = () => {
    if (activeVisualizations?.length >= maxVisualizations) {
      return;
    }

    const visualization = {
      id: Date.now()?.toString(),
      type: newVisualization?.type,
      dataSource: newVisualization?.dataSource,
      title: newVisualization?.title || `${visualizationTypes?.find(t => t?.value === newVisualization?.type)?.label} - ${new Date()?.toLocaleDateString()}`,
      createdAt: new Date()?.toISOString(),
      data: generateMockData(newVisualization?.type, newVisualization?.dataSource),
      parameters: newVisualization?.parameters
    };

    onVisualizationCreate(visualization);
    setIsCreating(false);
    setNewVisualization({
      type: 'bar',
      dataSource: 'papers',
      title: '',
      parameters: {}
    });
  };

  const generateMockData = (type, dataSource) => {
    // Mock data generation based on type and data source
    switch (dataSource) {
      case 'papers':
        return {
          labels: ['Microgravity', 'Radiation', 'Plant Biology', 'Cell Biology', 'Genetics'],
          values: [12, 8, 15, 10, 6]
        };
      case 'keywords':
        return {
          labels: ['Space', 'Biology', 'Microgravity', 'NASA', 'Research'],
          values: [25, 20, 18, 15, 12]
        };
      case 'timeline':
        return {
          labels: ['2019', '2020', '2021', '2022', '2023'],
          values: [5, 8, 12, 15, 18]
        };
      default:
        return {
          labels: ['Category A', 'Category B', 'Category C'],
          values: [10, 15, 8]
        };
    }
  };

  const handleDownloadVisualization = (visualization, format = 'png') => {
    // Mock download functionality
    const link = document.createElement('a');
    link.download = `${visualization?.title?.replace(/\s+/g, '_')}.${format}`;
    link.href = '#'; // In real implementation, this would be the chart image data
    link?.click();
    
    onVisualizationDownload(visualization, format);
  };

  const renderVisualizationCard = (visualization) => {
    const typeInfo = visualizationTypes?.find(t => t?.value === visualization?.type);
    
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
                onClick={() => handleDownloadVisualization(visualization)}
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
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-text-secondary">
              {dataSourceOptions?.find(d => d?.value === visualization?.dataSource)?.label}
            </span>
            <span className="text-xs text-text-secondary">•</span>
            <span className="text-xs text-text-secondary">
              {new Date(visualization.createdAt)?.toLocaleDateString()}
            </span>
          </div>
        </div>
        {/* Mock Chart Area */}
        <div className="p-4">
          <div className="h-32 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <div className="text-center">
              <Icon name={typeInfo?.icon || 'BarChart3'} size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-text-secondary">
                {typeInfo?.label} Visualization
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {visualization?.data?.labels?.length || 0} data points
              </p>
            </div>
          </div>
        </div>
        {/* Chart Actions */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              Data: {visualization?.data?.values?.reduce((a, b) => a + b, 0) || 0} total
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Maximize2"
                iconSize={12}
                className="text-xs"
              >
                Expand
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                iconSize={12}
                className="text-xs"
              >
                Configure
              </Button>
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
            <span>Data Visualizations</span>
          </h2>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreating(true)}
            disabled={activeVisualizations?.length >= maxVisualizations || selectedPapers?.length === 0}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Create Chart
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">
            {activeVisualizations?.length} of {maxVisualizations} charts
          </span>
          <span className="text-text-secondary">
            {selectedPapers?.length} papers selected
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-muted rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full scientific-transition"
            style={{ width: `${(activeVisualizations?.length / maxVisualizations) * 100}%` }}
          />
        </div>
      </div>
      {/* Create Visualization Modal */}
      {isCreating && (
        <div className="p-4 border-b border-border bg-accent/5">
          <h3 className="font-medium text-card-foreground mb-3">Create New Visualization</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Chart Type"
                options={visualizationTypes}
                value={newVisualization?.type}
                onChange={(value) => setNewVisualization(prev => ({ ...prev, type: value }))}
              />
              
              <Select
                label="Data Source"
                options={dataSourceOptions}
                value={newVisualization?.dataSource}
                onChange={(value) => setNewVisualization(prev => ({ ...prev, dataSource: value }))}
              />
            </div>
            
            <input
              type="text"
              placeholder="Chart title (optional)"
              value={newVisualization?.title}
              onChange={(e) => setNewVisualization(prev => ({ ...prev, title: e?.target?.value }))}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateVisualization}
                iconName="Plus"
                iconPosition="left"
                iconSize={14}
              >
                Create Chart
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Visualizations Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeVisualizations?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeVisualizations?.map(renderVisualizationCard)}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No Visualizations Yet
              </h3>
              <p className="text-text-secondary mb-4">
                Select papers from the search panel and create your first data visualization to analyze research trends and patterns.
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
      {/* Quick Actions Footer */}
      {activeVisualizations?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Quick Actions
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
                onClick={() => {
                  // Download all visualizations
                  activeVisualizations?.forEach(viz => handleDownloadVisualization(viz));
                }}
              >
                Download All
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
                onClick={() => {
                  // Clear all visualizations
                  activeVisualizations?.forEach(viz => onVisualizationDelete(viz?.id));
                }}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationManager;