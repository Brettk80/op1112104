import React from 'react';

interface ScheduleOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function ScheduleOption({
  selected,
  onClick,
  title,
  description,
  children
}: ScheduleOptionProps) {
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        selected 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected 
            ? 'border-blue-600' 
            : 'border-gray-300'
        }`}>
          {selected && (
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      {selected && children}
    </div>
  );
}