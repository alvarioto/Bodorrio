"use client";

type EventDetails = {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
};

// Function to format date to iCalendar format (YYYYMMDDTHHMMSS)
const formatICalDate = (date: Date): string => {
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

export const createAndDownloadIcsFile = (event: EventDetails) => {
  const { title, description, location, startTime, endTime } = event;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventoUnico//NONSGML v1.0//ES',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Madrid',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${startTime.getTime()}@eventounico.com`,
    `DTSTAMP:${formatICalDate(new Date())}Z`,
    `DTSTART;TZID=Europe/Madrid:${formatICalDate(startTime)}`,
    `DTEND;TZID=Europe/Madrid:${formatICalDate(endTime)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
