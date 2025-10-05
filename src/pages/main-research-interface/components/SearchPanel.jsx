import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreVertical, ExternalLink, X, Calendar, Users, BookOpen, Quote } from 'lucide-react';

const SearchPanel = ({
  selectedPapers = [],
  onPaperSelectionChange = () => {},
  searchQuery = '',
  onSearchQueryChange = () => {},
  isLoading = false,
  onSearch = () => {},
  onSynthesizeSelected = () => {}
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all',
    studyType: 'all',
    organism: 'all'
  });

  const [results, setResults] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayResults, setDisplayResults] = useState([]);

  const filterOptions = {
    dateRange: [{ value: 'all', label: 'All Time' }, { value: 'recent', label: 'Last 5 Years' }],
    studyType: [{ value: 'all', label: 'All Studies' }, { value: 'microgravity', label: 'Microgravity' }],
    organism: [{ value: 'all', label: 'All Organisms' }, { value: 'human', label: 'Human' }],
  };

  useEffect(() => { setLocalQuery(searchQuery); }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchQueryChange(localQuery);
    onSearch(localQuery, searchFilters);
  };

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlightMatches = (text, term) => {
    if (!term?.trim()) return text;
    try {
      const pattern = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      const parts = String(text ?? '').split(pattern);
      return parts.map((part, idx) => (
        part.toLowerCase() === term.toLowerCase() ? (
          <span key={idx} className="underline underline-offset-2 decoration-blue-500">{part}</span>
        ) : (
          <span key={idx}>{part}</span>
        )
      ));
    } catch (e) {
      return text;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const res = await fetch('/api/papers');
        const data = await res.json();
        // Normalize to the shape used in UI
        const normalized = data.map((item, idx) => ({
          id: idx + 1,
          title: item.original_title || item.title || 'Untitled',
          abstract: item.abstract || '',
          authors: typeof item.authors === 'string' ? item.authors.split(/,\s*/) : (item.authors || []),
          year: item.year || item.publication_year || 'N/A',
          journal: item.journal || item.source || '—',
          keywords: item.keywords || [],
          citations: item.citations || 0,
          url: item.url || '#',
        }));
        setResults(normalized);
        setDisplayResults(normalized);
      } catch (err) {
        console.error('Failed to load papers', err);
        setResults([]);
        setDisplayResults([]);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Debounce user query to optimize re-calculation
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(localQuery.trim()), 200);
    return () => clearTimeout(t);
  }, [localQuery]);

  const toLower = (s) => String(s || '').toLowerCase();
  const countMatches = (text, term) => {
    if (!term) return 0;
    try {
      const re = new RegExp(escapeRegExp(term), 'gi');
      return (String(text || '').match(re) || []).length;
    } catch (e) {
      return 0;
    }
  };

  const scorePaper = (paper, term) => {
    if (!term) return 0;
    const t = toLower(term);
    const title = toLower(paper.title);
    const abstract = toLower(paper.abstract);
    const authors = toLower((paper.authors || []).join(', '));
    const keywords = toLower((paper.keywords || []).join(' '));

    let score = 0;
    if (title === t) score += 300;
    if (title.startsWith(t)) score += 200;
    if (title.includes(t)) score += 150;

    try {
      const wb = new RegExp(`\\b${escapeRegExp(t)}\\b`, 'i');
      if (wb.test(paper.title)) score += 80;
    } catch {}

    score += countMatches(keywords, t) * 60;
    score += countMatches(abstract, t) * 30;
    score += countMatches(authors, t) * 20;

    return score;
  };

  // Recompute displayResults when query or results change
  useEffect(() => {
    if (!debouncedQuery) {
      setDisplayResults(results);
      return;
    }
    const ranked = results
      .map(p => ({ paper: p, score: scorePaper(p, debouncedQuery) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.paper);
    setDisplayResults(ranked.length ? ranked : results);
  }, [debouncedQuery, results]);

  const handlePaperToggle = (paper) => {
    const isSelected = selectedPapers.some(p => p.id === paper.id);
    if (isSelected) {
      onPaperSelectionChange(selectedPapers.filter(p => p.id !== paper.id));
    } else {
      onPaperSelectionChange([...selectedPapers, paper]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent p-4 text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Search Papers</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={onSynthesizeSelected}
            disabled={selectedPapers.length === 0 || isLoading || isLoadingData}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow"
            title="Generar síntesis con TESS de los papers seleccionados"
          >
            TESS Synthesis
          </button>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search papers" value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} className="w-full bg-secondary border border-input rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"/>
        </div>
        {isFiltersExpanded && (
          <div className="grid grid-cols-1 gap-3 pt-3 border-t border-border">
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <select value={searchFilters[key]} onChange={(e) => setSearchFilters(prev => ({ ...prev, [key]: e.target.value }))} className="w-full bg-input border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </form>

      {selectedPapers.length > 0 && (
        <div className="mb-4 p-2 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-400 font-medium">{selectedPapers.length} papers selected</span>
            <button onClick={() => onPaperSelectionChange([])} className="p-1 rounded-full hover:bg-blue-600/20 text-blue-400"><X size={14} /></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {isLoading || isLoadingData ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-border bg-secondary animate-pulse">
              <div className="h-4 bg-muted/50 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted/50 rounded w-full mb-1"></div>
              <div className="h-3 bg-muted/50 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          displayResults.map((paper) => {
            const isSelected = selectedPapers.some(p => p.id === paper.id);
            return (
              <div key={paper.id} className={`p-3 rounded-lg border transition-colors ${isSelected ? 'border-blue-600/50 bg-blue-600/10' : 'border-border bg-secondary/50 hover:border-accent'}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={isSelected} onChange={() => handlePaperToggle(paper)} className="form-checkbox h-4 w-4 mt-1 bg-transparent border-muted-foreground text-blue-600 rounded focus:ring-blue-500"/>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground mb-1">{highlightMatches(paper.title, localQuery)}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Users size={12} /><span>{highlightMatches(paper.authors.join(', '), localQuery)}</span></span>
                      <span className="flex items-center gap-1"><Calendar size={12} /><span>{paper.year}</span></span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-2">{highlightMatches(paper.abstract, localQuery)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {paper.keywords.map(kw => <span key={kw} className="px-1.5 py-0.5 bg-accent/20 text-accent/80 text-xs rounded">{highlightMatches(kw, localQuery)}</span>)}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Quote size={12} /><span>{paper.citations}</span></span>
                    </div>
                  </div>
                  <a href={paper.url} target="_blank" rel="noreferrer" className="p-1 rounded hover:bg-muted/50"><ExternalLink className="w-4 h-4 text-muted-foreground"/></a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
