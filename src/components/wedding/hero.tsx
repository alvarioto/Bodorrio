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
    <div
      className="relative w-full text-center pt-36 pb-40 rounded-t-2xl"
      style={{
        backgroundImage: 'url(/paper-texture.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <Image
          src="/divisor-top.png"
          alt="Decoración floral superior"
          width={500}
          height={105}
          className="w-auto h-auto max-w-[500px] opacity-70"
        />
      </div>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div>
          <div className="max-w-4xl mx-auto mb-8">
              <p className="text-muted-foreground mt-8 mb-4">Bienvenidos a la invitación de</p>
              <h1 className="font-headline text-foreground">
                Álvaro <span className="ampersand">&amp;</span> Carmen
              </h1>
              <h2 className="text-muted-foreground mt-4">Nuestra Boda</h2>
              <h3 className="font-headline text-primary my-6">08 · 08 · 2026</h3>
              <p className="max-w-xl mx-auto text-muted-foreground">
                Con gran alegría queremos compartir este día tan especial con vosotros. Vuestra presencia es nuestro mejor regalo.
              </p>
          </div>
          <h4 className="text-muted-foreground tracking-widest uppercase mb-4">¡FALTAN!</h4>
          <Countdown />
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <Image
          src="/banner_divisor_horizontal.png"
          alt="Separador floral"
          width={500}
          height={105}
          className="w-auto h-auto opacity-70"
        />
      </div>
    </div>
  );
};

export default HeroSection;
