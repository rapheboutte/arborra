"use client";

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// Removed CSS import as it's included via CDN in globals.css

const events = [
  { title: 'Annual HIPAA Review', date: '2024-12-15', color: 'amber' },
  { title: 'GDPR Re-Certification', date: '2024-12-20', color: 'green' },
  { title: 'Policy Renewal', date: '2024-12-25', color: 'red' },
];

const Calendar = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventColor="blue"
      />
    </div>
  );
};

export default Calendar;
