import React from 'react';
import Calendar from '../calendar';

const CalendarPage = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Calendar</h1>
      <Calendar />
    </div>
  );
};

export default CalendarPage;
