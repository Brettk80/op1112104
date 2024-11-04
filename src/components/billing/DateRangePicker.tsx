import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';

interface DateRangePickerProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, endDate] = value;

  const handleChange = (dates: [Date | null, Date | null]) => {
    onChange(dates);
    if (dates[0] && dates[1]) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
        {startDate && endDate ? (
          `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
        ) : (
          'Select dates'
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;