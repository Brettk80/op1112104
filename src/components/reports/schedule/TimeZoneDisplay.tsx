import React from 'react';
import { format, addMinutes } from 'date-fns';

interface TimeZone {
  name: string;
  offset: number;
}

interface TimeZoneDisplayProps {
  timeZones: TimeZone[];
  selectedDate: Date;
}

export default function TimeZoneDisplay({ timeZones, selectedDate }: TimeZoneDisplayProps) {
  const getTimeForZone = (offset: number) => {
    if (!selectedDate) return "--:--";
    const zoneTime = addMinutes(selectedDate, offset);
    return format(zoneTime, "h:mm a");
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h5 className="text-xs font-medium text-gray-900 mb-2">Broadcast Times</h5>
      <div className="grid grid-cols-2 gap-2">
        {timeZones.map((zone) => (
          <div key={zone.name} className="flex justify-between text-xs">
            <span className="text-gray-600">{zone.name}</span>
            <span className="text-gray-900">{getTimeForZone(zone.offset)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}