import React, { useState, useEffect } from 'react';
import { HelpCircle, Save, User, LogOut, Download, FileText, Edit2, Menu, X } from 'lucide-react';

// A simple placeholder for the new logo SVG
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12C6 10.3431 7.34315 9 9 9H23C24.6569 9 26 10.3431 26 12V23C26 24.6569 24.6569 26 23 26H9C7.34315 26 6 24.6569 6 23V12Z" fill="#2563EB"/>
    <path d="M6 12C6 10.3431 7.34315 9 9 9H23C24.6569 9 26 10.3431 26 12V14H6V12Z" fill="#3B82F6"/>
    <path d="M10 6C10 4.34315 11.3431 3 13 3H19C20.6569 3 22 4.34315 22 6V9H10V6Z" fill="#60A5FA"/>
  </svg>
);

// A placeholder for the user's avatar, now a button
const UserAvatar = ({ onClick }) => (
  <button onClick={onClick} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring">
    <span className="text-sm font-semibold text-foreground">ER</span>
  </button>
);

const WorkspaceHeader = ({ 
  sessionTitle = "Research Session", 
  onSessionSave = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(sessionTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    setCurrentTitle(sessionTitle);
  }, [sessionTitle]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onSessionSave(currentTitle);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') {
      setCurrentTitle(sessionTitle);
      setIsEditingTitle(false);
    }
  };

  const handleMenuAction = (action) => {
    if (action === 'save') {
      onSessionSave(currentTitle);
    } else if (action === 'export') {
      // Mock data export functionality
      console.log(`Mock Export: Exporting data for session "${currentTitle}"`);
      // In a real app, this would trigger a download or API call.
    } else {
      console.log(`${action} clicked`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">
              Space Biology Data Explorer
            </h1>
          </div>
          {/* Session Title Editor */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {isEditingTitle ? (
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="bg-input border border-border rounded px-2 py-0.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
            ) : (
              <button onClick={() => setIsEditingTitle(true)} className="flex items-center gap-1 hover:text-foreground">
                <span>{currentTitle}</span>
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Controls and User Avatar */}
        <div className="flex items-center gap-4 relative">
          {/* Mobile Panel Toggle */}
          <button onClick={onToggleCollapse} className="md:hidden p-1.5 rounded-full hover:bg-secondary">
            {isCollapsed ? <Menu className="w-5 h-5 text-muted-foreground" /> : <X className="w-5 h-5 text-muted-foreground" />}
          </button>

          <button className="p-1.5 rounded-full hover:bg-secondary hidden md:block">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>

          <UserAvatar onClick={toggleMenu} />

          {/* User Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button onClick={() => handleMenuAction('save')} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-accent">
                  <Save className="w-4 h-4" />
                  <span>Save Session</span>
                </button>
                <button onClick={() => handleMenuAction('export')} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-accent">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                <div className="my-1 h-px bg-border" />
                <button onClick={() => handleMenuAction('profile')} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-accent">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button onClick={() => handleMenuAction('logout')} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-accent">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default WorkspaceHeader;
