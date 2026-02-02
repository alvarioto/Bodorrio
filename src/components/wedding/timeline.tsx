"use client";

import React from 'react';
import { BusIcon, ClinkingGlassesIcon, DinnerIcon, PartyIcon, NightBusIcon, EndOfPartyIcon, BusAwayIcon, IconWrapper } from './animated-icons';
import { RingsIcon } from './animated-icons';

const timelineEvents = [
  { time: '18:00', title: 'Ceremonia', icon: <IconWrapper><RingsIcon className="w-9 h-9" /></IconWrapper> },
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
    <div className="ml-14 md:ml-16 pl-10">
      <p className="font-bold text-xl text-primary">{time}</p>
      <h4 className="font-headline text-3xl mt-2">{title}</h4>
    </div>
  </div>
);

const TimelineSection = () => {
  return (
    <section id="cronologia" className="py-16 sm:py-24 w-full">
      <div className="text-center mb-20">
        <h2 className="font-headline text-6xl md:text-7xl">Cronología</h2>
        <p className="text-muted-foreground mt-4 text-lg">El plan para nuestro gran día.</p>
      </div>
      <div className="relative max-w-xl mx-auto pl-12 sm:pl-20">
        <div className="absolute left-12 sm:left-20 top-0 h-full w-px bg-primary/50" />
        <div className="space-y-16">
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
