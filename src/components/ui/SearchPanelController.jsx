import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import { Checkbox } from './Checkbox';

const SearchPanelController = ({
  selectedPapers = [],
  onPaperSelectionChange = () => {},
  searchQuery = '',
  onSearchQueryChange = () => {},
  searchResults = [],
  isLoading = false,
  onSearch = () => {},
  maxSelections = 10
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all',
    studyType: 'all',
    organism: 'all'
  });
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearchQueryChange(localQuery);
    onSearch(localQuery, searchFilters);
  };

  const handlePaperToggle = (paper) => {
    const isSelected = selectedPapers?.some(p => p?.id === paper?.id);
    
    if (isSelected) {
      // Remove paper
      const newSelection = selectedPapers?.filter(p => p?.id !== paper?.id);
      onPaperSelectionChange(newSelection);
    } else {
      // Add paper (check max limit)
      if (selectedPapers?.length < maxSelections) {
        const newSelection = [...selectedPapers, paper];
        onPaperSelectionChange(newSelection);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedPapers?.length === searchResults?.length) {
      // Deselect all
      onPaperSelectionChange([]);
    } else {
      // Select all (up to max limit)
      const newSelection = searchResults?.slice(0, maxSelections);
      onPaperSelectionChange(newSelection);
    }
  };

  const handleClearSelection = () => {
    onPaperSelectionChange([]);
  };

  const filterOptions = {
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: 'recent', label: 'Last 5 Years' },
      { value: 'decade', label: 'Last 10 Years' }
    ],
    studyType: [
      { value: 'all', label: 'All Studies' },
      { value: 'microgravity', label: 'Microgravity' },
      { value: 'radiation', label: 'Radiation' },
      { value: 'plant', label: 'Plant Biology' },
      { value: 'cell', label: 'Cell Biology' }
    ],
    organism: [
      { value: 'all', label: 'All Organisms' },
      { value: 'human', label: 'Human' },
      { value: 'mouse', label: 'Mouse' },
      { value: 'plant', label: 'Plants' },
      { value: 'microbe', label: 'Microorganisms' }
    ]
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="Search" size={20} className="text-primary" />
            <span>NASA Dataset Search</span>
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            iconName={isFiltersExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            Filters
          </Button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <Input
              type="search"
              placeholder="Search space biology research papers..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e?.target?.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Search"
              iconSize={16}
            >
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          {isFiltersExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border">
              {Object.entries(filterOptions)?.map(([filterKey, options]) => (
                <div key={filterKey}>
                  <label className="block text-xs font-medium text-text-secondary mb-1 capitalize">
                    {filterKey?.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <select
                    value={searchFilters?.[filterKey]}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      [filterKey]: e?.target?.value
                    }))}
                    className="w-full bg-input border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {options?.map(option => (
                      <option key={option?.value} value={option?.value}>
                        {option?.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Selection Summary */}
        {selectedPapers?.length > 0 && (
          <div className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {selectedPapers?.length} of {maxSelections} papers selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                iconName="X"
                iconSize={14}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Results Header */}
      {searchResults?.length > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {searchResults?.length} results found
            </span>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedPapers?.length === searchResults?.length && searchResults?.length > 0}
                onChange={handleSelectAll}
                label="Select All"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)]?.map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResults?.length > 0 ? (
          <div className="p-4 space-y-3">
            {searchResults?.map((paper) => {
              const isSelected = selectedPapers?.some(p => p?.id === paper?.id);
              const canSelect = selectedPapers?.length < maxSelections || isSelected;
              
              return (
                <div
                  key={paper?.id}
                  className={`p-4 rounded-lg border scientific-transition cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : canSelect
                      ? 'border-border bg-card hover:border-accent hover:bg-accent/5' :'border-border bg-muted/50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => canSelect && handlePaperToggle(paper)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => canSelect && handlePaperToggle(paper)}
                      disabled={!canSelect}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground mb-2 line-clamp-2">
                        {paper?.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-xs text-text-secondary mb-2">
                        <span className="flex items-center space-x-1">
                          <Icon name="Calendar" size={12} />
                          <span>{paper?.year}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Users" size={12} />
                          <span>{paper?.authors?.slice(0, 2)?.join(', ')}{paper?.authors?.length > 2 ? ' et al.' : ''}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="BookOpen" size={12} />
                          <span>{paper?.journal}</span>
                        </span>
                      </div>
                      
                      <p className="text-sm text-text-secondary line-clamp-3 mb-3">
                        {paper?.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {paper?.keywords?.slice(0, 3)?.map((keyword, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="ExternalLink"
                          iconSize={14}
                          onClick={(e) => {
                            e?.stopPropagation();
                            window.open(paper?.url, '_blank');
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Search NASA Space Biology Data
              </h3>
              <p className="text-text-secondary max-w-sm">
                Enter keywords to discover research papers, datasets, and studies from NASA's space biology research programs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanelController;