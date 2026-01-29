"use client";

import React, { useState, useEffect } from 'react';

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
          <span className="font-headline text-4xl md:text-6xl text-primary">{String(value).padStart(2, '0')}</span>
          <span className="text-sm text-muted-foreground uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  return (
    <header className="w-full text-center py-20 md:py-32">
      <div className="container mx-auto px-4">
        <p className="text-lg text-muted-foreground mb-4">Bienvenidos a la invitación de</p>
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-gray-800">
          Álvaro & Carmen
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mt-4">Nuestra Boda</h2>
        <p className="font-headline text-4xl md:text-5xl text-primary my-8">08 · 08 · 2026</p>
        <p className="max-w-xl mx-auto text-muted-foreground mb-12">
          Con gran alegría queremos compartir este día tan especial con vosotros. Vuestra presencia es nuestro mejor regalo.
        </p>
        <Countdown />
      </div>
    </header>
  );
};

export default HeroSection;
