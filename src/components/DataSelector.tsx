
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTypeOption } from '@/types';

interface DataSelectorProps {
  options: DataTypeOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DataSelector = ({ options, value, onChange, className }: DataSelectorProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  
  return (
    <div className={cn("inline-flex bg-muted/50 backdrop-blur-sm rounded-lg p-1", className)}>
      {options.map((option) => {
        const isActive = option.value === value;
        const isHovered = hoveredOption === option.value;
        
        return (
          <button
            key={option.value}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
              isActive 
                ? "text-white" 
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onChange(option.value)}
            onMouseEnter={() => setHoveredOption(option.value)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            {isActive && (
              <span 
                className="absolute inset-0 rounded-md transition-all duration-300 ease-in-out z-0"
                style={{ 
                  backgroundColor: option.color,
                  boxShadow: `0 0 16px ${option.color}40`,
                }}
              />
            )}
            {isHovered && !isActive && (
              <span 
                className="absolute inset-0 rounded-md bg-gray-200/70 dark:bg-gray-700/50 transition-all duration-300 ease-in-out z-0"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DataSelector;
