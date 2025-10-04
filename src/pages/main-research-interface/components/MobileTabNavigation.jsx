import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileTabNavigation = ({
  activePanel = 'search',
  onPanelChange = () => {},
  selectedPapersCount = 0,
  visualizationsCount = 0
}) => {
  const panels = [
    {
      id: 'search',
      label: 'Search',
      icon: 'Search',
      badge: selectedPapersCount > 0 ? selectedPapersCount : null
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: 'MessageSquare',
      badge: null
    },
    {
      id: 'visualizations',
      label: 'Charts',
      icon: 'BarChart3',
      badge: visualizationsCount > 0 ? visualizationsCount : null
    }
  ];

  return (
    <div className="md:hidden bg-card border-b border-border">
      <div className="flex">
        {panels?.map((panel) => (
          <button
            key={panel?.id}
            onClick={() => onPanelChange(panel?.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium scientific-transition border-b-2 ${
              activePanel === panel?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-foreground hover:border-border'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="relative">
                <Icon name={panel?.icon} size={16} />
                {panel?.badge && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {panel?.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{panel?.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileTabNavigation;