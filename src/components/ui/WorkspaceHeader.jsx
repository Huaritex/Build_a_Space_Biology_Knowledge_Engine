import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const WorkspaceHeader = ({ 
  sessionTitle = "Research Session", 
  onSessionSave = () => {}, 
  isCollapsed = false,
  onToggleCollapse = () => {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(sessionTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onSessionSave(currentTitle);
  };

  const handleTitleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleTitleSave();
    }
    if (e?.key === 'Escape') {
      setCurrentTitle(sessionTitle);
      setIsEditingTitle(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border scientific-shadow">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - NASA Logo and Session Title */}
        <div className="flex items-center space-x-6">
          {/* NASA Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" className="text-primary-foreground"/>
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-primary-foreground"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Space Biology Explorer</h1>
              <p className="text-xs text-text-secondary">NASA Research Platform</p>
            </div>
          </div>

          {/* Session Title */}
          <div className="hidden md:flex items-center space-x-2 ml-8">
            <Icon name="FileText" size={16} className="text-text-secondary" />
            {isEditingTitle ? (
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e?.target?.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            ) : (
              <button
                onClick={handleTitleEdit}
                className="text-sm text-text-secondary hover:text-foreground scientific-transition flex items-center space-x-1"
              >
                <span>{currentTitle}</span>
                <Icon name="Edit2" size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Controls and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Panel Toggle for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="md:hidden"
          >
            <Icon name={isCollapsed ? "Menu" : "X"} size={20} />
          </Button>

          {/* Session Controls */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSessionSave(currentTitle)}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Session
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Data
            </Button>
          </div>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="relative"
            >
              <Icon name="MoreVertical" size={20} />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg scientific-shadow-lg z-50">
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground scientific-transition flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground scientific-transition flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground scientific-transition flex items-center space-x-2">
                    <Icon name="BookOpen" size={16} />
                    <span>Documentation</span>
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground scientific-transition flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground scientific-transition flex items-center space-x-2">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Icon name="User" size={16} className="text-accent-foreground" />
          </div>
        </div>
      </div>
      {/* Mobile Session Title */}
      <div className="md:hidden px-6 pb-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={14} className="text-text-secondary" />
          {isEditingTitle ? (
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e?.target?.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyPress}
              className="bg-input border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1"
              autoFocus
            />
          ) : (
            <button
              onClick={handleTitleEdit}
              className="text-sm text-text-secondary hover:text-foreground scientific-transition flex items-center space-x-1 flex-1"
            >
              <span>{currentTitle}</span>
              <Icon name="Edit2" size={12} />
            </button>
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