"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ClinkingGlassesIcon, DinnerIcon, PartyIcon, EndOfPartyIcon, RingsIcon, AnimatedBusIcon } from './animated-icons';

const timelineEvents = [
  { time: '18:00', title: 'Ceremonia', icon: <RingsIcon className="w-20 h-20 text-foreground" /> },
  { time: '19:30', title: 'Salida del autobús', icon: <AnimatedBusIcon className="w-20 h-20 text-foreground" /> },
  { time: '20:00', title: 'Recepción', icon: <ClinkingGlassesIcon className="w-20 h-20 text-foreground" /> },
  { time: '22:00', title: 'Cena', icon: <DinnerIcon className="w-20 h-20 text-foreground" /> },
  { time: '01:00', title: '¡Fiesta!', icon: <PartyIcon className="w-20 h-20 text-foreground" /> },
  { time: '03:00', title: 'Salida primer autobús', icon: <AnimatedBusIcon className="w-20 h-20 text-foreground" /> },
  { time: '06:00', title: 'Fin de fiesta', icon: <EndOfPartyIcon className="w-20 h-20 text-foreground" /> },
  { time: '06:05', title: 'Salida último autobús', icon: <AnimatedBusIcon className="w-20 h-20 text-foreground" /> },
];

const TimelineItem = ({ time, title, icon, isRight }: { time: string, title: string, icon: React.ReactNode, isRight: boolean }) => (
  <div className="relative flex items-center group">
    {isRight ? (
      <>
        <div className="w-1/2" />
        <div className="w-1/2 pl-24 md:pl-32 flex justify-start items-center">
          <div className="text-left">
            <p className="font-bold text-xl text-primary">{time}</p>
            <h4 className="font-headline text-3xl mt-1">{title}</h4>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="w-1/2 pr-24 md:pr-32 flex justify-end items-center">
          <div className="text-right">
            <p className="font-bold text-xl text-primary">{time}</p>
            <h4 className="font-headline text-3xl mt-1">{title}</h4>
          </div>
        </div>
        <div className="w-1/2" />
      </>
    )}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="w-24 h-24 rounded-full bg-background border-2 border-primary shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
    </div>
  </div>
);


const TimelineSection = () => {
  return (
    <section id="cronologia" className="py-24 sm:py-32 w-full">
      <div className="text-center mb-24">
        <h2 className="font-headline text-5xl md:text-6xl">Cronología</h2>
        <p className="text-muted-foreground mt-4 text-lg">El plan para nuestro gran día.</p>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-primary/50" />
        <div className="space-y-40">
          {timelineEvents.map((event, index) => (
            <TimelineItem
              key={index}
              {...event}
              isRight={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
