"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ClinkingGlassesIcon, DinnerIcon, PartyIcon, EndOfPartyIcon, RingsIcon, AnimatedBusIcon } from './animated-icons';

const timelineEvents = [
  { time: '18:00', title: 'Ceremonia', icon: <RingsIcon className="w-20 h-20" /> },
  { time: '19:30', title: 'Salida del autobús', icon: <AnimatedBusIcon className="w-24 h-24" /> },
  { time: '20:00', title: 'Recepción', icon: <ClinkingGlassesIcon className="w-16 h-16" /> },
  { time: '22:00', title: 'Cena', icon: <DinnerIcon className="w-16 h-16" /> },
  { time: '01:00', title: '¡Fiesta!', icon: <PartyIcon className="w-16 h-16" /> },
  { time: '03:00', title: 'Salida primer autobús', icon: <AnimatedBusIcon className="w-24 h-24" /> },
  { time: '06:00', title: 'Fin de fiesta', icon: <EndOfPartyIcon className="w-16 h-16" /> },
  { time: '06:05', title: 'Salida último autobús', icon: <AnimatedBusIcon className="w-24 h-24" /> },
];

const TimelineItem = ({ time, title, icon, isRight }: { time: string, title: string, icon: React.ReactNode, isRight: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          rootMargin: '0px',
          threshold: 0.3
        }
      );
  
      const currentRef = itemRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
  
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);
    
    return (
      <div
        ref={itemRef}
        className={cn(
          "relative flex items-center group my-32 transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {isRight ? (
          <>
            <div className="w-1/2" />
            <div className={cn(
              "w-1/2 pl-28 flex justify-start items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "-translate-x-10"
            )}>
              <div className="text-left">
                <p className="font-bold text-2xl text-primary">{time}</p>
                <h4 className="font-headline text-4xl mt-1">{title}</h4>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              "w-1/2 pr-28 flex justify-end items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "translate-x-10"
            )}>
              <div className="text-right">
                <p className="font-bold text-2xl text-primary">{time}</p>
                <h4 className="font-headline text-4xl mt-1">{title}</h4>
              </div>
            </div>
            <div className="w-1/2" />
          </>
        )}
        <div className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-500 ease-out",
          isVisible ? "scale-100" : "scale-0"
          )} style={{transitionDelay: isVisible ? '200ms' : '0ms' }}>
          <div className="w-28 h-28 rounded-full bg-secondary border-2 border-primary shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        </div>
      </div>
    );
};


const TimelineSection = () => {
  return (
    <section id="cronologia" className="py-24 sm:py-32 w-full overflow-x-hidden">
      <div className="text-center mb-24">
        <h2 className="font-headline text-5xl md:text-6xl">Cronología</h2>
        <p className="text-muted-foreground mt-4 text-lg">El plan para nuestro gran día.</p>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-primary/50" />
        <div className="space-y-32">
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
