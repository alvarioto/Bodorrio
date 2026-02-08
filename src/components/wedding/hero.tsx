"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Countdown = () => {
  const weddingDate = new Date('2026-08-08T18:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="flex justify-center gap-4 md:gap-8 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <h2 className="font-headline text-primary">{String(value).padStart(2, '0')}</h2>
          <span className="text-muted-foreground uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  return (
    <header
      className="w-full text-center py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12">
            <p className="text-muted-foreground mb-4">Bienvenidos a la invitación de</p>
            <h1 className="font-headline text-gray-800">
              Álvaro <span className="ampersand">&amp;</span> Carmen
            </h1>
            <h2 className="text-muted-foreground mt-4">Nuestra Boda</h2>
            <h3 className="font-headline text-primary my-8">08 · 08 · 2026</h3>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Con gran alegría queremos compartir este día tan especial con vosotros. Vuestra presencia es nuestro mejor regalo.
            </p>
        </div>
        <Countdown />
      </div>
    </header>
  );
};

export default HeroSection;
