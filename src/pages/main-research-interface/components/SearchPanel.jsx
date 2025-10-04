import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchPanel = ({
  selectedPapers = [],
  onPaperSelectionChange = () => {},
  searchQuery = '',
  onSearchQueryChange = () => {},
  isLoading = false,
  onSearch = () => {}
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all',
    studyType: 'all',
    organism: 'all'
  });
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Mock search results
  const mockSearchResults = [
    {
      id: 1,
      title: "Effects of Microgravity on Plant Cell Wall Development in Arabidopsis thaliana",
      abstract: "This study investigates how microgravity conditions affect the development and structure of plant cell walls in Arabidopsis thaliana. Results show significant changes in cellulose deposition patterns and lignification processes under space conditions.",
      authors: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Elena Rodriguez"],
      year: 2023,
      journal: "Space Biology Research",
      keywords: ["microgravity", "plant biology", "cell walls", "arabidopsis"],
      url: "https://nasa.gov/research/paper1",
      citations: 45
    },
    {
      id: 2,
      title: "Radiation Exposure Effects on Human Cellular DNA Repair Mechanisms",
      abstract: "Comprehensive analysis of DNA repair pathway responses to cosmic radiation exposure in human cell cultures. The study reveals adaptive mechanisms and potential therapeutic targets for space missions.",
      authors: ["Dr. James Wilson", "Dr. Lisa Park", "Dr. Robert Kim"],
      year: 2023,
      journal: "Aerospace Medicine",
      keywords: ["radiation", "DNA repair", "human cells", "space medicine"],
      url: "https://nasa.gov/research/paper2",
      citations: 62
    },
    {
      id: 3,
      title: "Microbial Community Dynamics in Closed-Loop Life Support Systems",
      abstract: "Investigation of microbial ecosystem stability and diversity in spacecraft environmental control systems. Findings provide insights for long-duration space missions and planetary habitats.",
      authors: ["Dr. Amanda Foster", "Dr. David Lee", "Dr. Maria Santos"],
      year: 2022,
      journal: "Astrobiology",
      keywords: ["microbiome", "life support", "space habitats", "ecology"],
      url: "https://nasa.gov/research/paper3",
      citations: 38
    },
    {
      id: 4,
      title: "Bone Density Changes in Simulated Mars Gravity Conditions",
      abstract: "Long-term study of bone metabolism and density changes in laboratory animals exposed to Mars-equivalent gravitational conditions. Results inform countermeasure development for planetary missions.",
      authors: ["Dr. Thomas Anderson", "Dr. Jennifer Wu", "Dr. Carlos Mendez"],
      year: 2022,
      journal: "Space Physiology",
      keywords: ["bone density", "mars gravity", "physiology", "countermeasures"],
      url: "https://nasa.gov/research/paper4",
      citations: 29
    },
    {
      id: 5,
      title: "Protein Crystallization Enhancement in Microgravity Environments",
      abstract: "Analysis of protein crystal formation quality and structure in microgravity conditions compared to Earth-based controls. Demonstrates improved crystal quality for pharmaceutical applications.",
      authors: ["Dr. Rachel Green", "Dr. Kevin Zhang", "Dr. Sophie Miller"],
      year: 2023,
      journal: "Crystal Growth & Design",
      keywords: ["protein crystallization", "microgravity", "pharmaceuticals", "structure"],
      url: "https://nasa.gov/research/paper5",
      citations: 51
    }
  ];

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
      const newSelection = selectedPapers?.filter(p => p?.id !== paper?.id);
      onPaperSelectionChange(newSelection);
    } else {
      const newSelection = [...selectedPapers, paper];
      onPaperSelectionChange(newSelection);
    }
  };

  const handlePaperMenuAction = (paper, action) => {
    if (action === 'goToUrl') {
      window.open(paper?.url, '_blank');
    }
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
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="Search" size={20} className="text-primary" />
            <span>Search Papers</span>
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
              placeholder="Search NASA datasets..."
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
            <div className="grid grid-cols-1 gap-3 pt-3 border-t border-border">
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

        {/* Paper Counter */}
        {selectedPapers?.length > 0 && (
          <div className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {selectedPapers?.length} papers selected for chat
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPaperSelectionChange([])}
                iconName="X"
                iconSize={14}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
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
        ) : (
          <div className="p-4 space-y-3">
            {mockSearchResults?.map((paper) => {
              const isSelected = selectedPapers?.some(p => p?.id === paper?.id);
              
              return (
                <div
                  key={paper?.id}
                  className={`p-4 rounded-lg border scientific-transition ${
                    isSelected
                      ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-accent hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handlePaperToggle(paper)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-card-foreground mb-2 line-clamp-2 flex-1">
                          {paper?.title}
                        </h3>
                        
                        {/* Three-dot menu */}
                        <div className="relative ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePaperMenuAction(paper, 'goToUrl')}
                            className="w-6 h-6"
                            title="Go to URL"
                          >
                            <Icon name="ExternalLink" size={14} />
                          </Button>
                        </div>
                      </div>
                      
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
                        
                        <span className="text-xs text-text-secondary flex items-center space-x-1">
                          <Icon name="Quote" size={12} />
                          <span>{paper?.citations} citations</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;