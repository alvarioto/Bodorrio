"use client";

import React from 'react';
import { BusIcon, ClinkingGlassesIcon, DinnerIcon, PartyIcon, NightBusIcon, EndOfPartyIcon, BusAwayIcon } from './animated-icons';
import { RingsIcon } from './animated-icons';

const timelineEvents = [
  { time: '18:00', title: 'Ceremonia', icon: <RingsIcon className="w-7 h-7" /> },
  { time: '19:30', title: 'Salida del autobús', icon: <BusIcon /> },
  { time: '20:00', title: 'Recepción', icon: <ClinkingGlassesIcon /> },
  { time: '22:00', title: 'Cena', icon: <DinnerIcon /> },
  { time: '01:00', title: '¡Fiesta!', icon: <PartyIcon /> },
  { time: '03:00', title: 'Salida primer autobús', icon: <NightBusIcon /> },
  { time: '06:00', title: 'Fin de fiesta', icon: <EndOfPartyIcon /> },
  { time: '06:05', title: 'Salida último autobús', icon: <BusAwayIcon /> },
];

const TimelineItem = ({ time, title, icon, isLast }: { time: string, title: string, icon: React.ReactNode, isLast: boolean }) => (
  <div className="relative group">
    {icon}
    <div className="ml-8 md:ml-12 pl-8">
      <p className="font-bold text-lg text-primary">{time}</p>
      <h4 className="font-headline text-2xl mt-1">{title}</h4>
    </div>
  </div>
);

const TimelineSection = () => {
  return (
    <section id="cronologia" className="py-16 sm:py-24 w-full">
      <div className="text-center mb-16">
        <h2 className="font-headline text-5xl md:text-6xl">Cronología</h2>
        <p className="text-muted-foreground mt-2">El plan para nuestro gran día.</p>
      </div>
      <div className="relative max-w-lg mx-auto pl-8 sm:pl-16">
        <div className="absolute left-8 sm:left-16 top-0 h-full w-px bg-primary/50" />
        <div className="space-y-12">
          {timelineEvents.map((event, index) => (
            <TimelineItem
              key={index}
              {...event}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
