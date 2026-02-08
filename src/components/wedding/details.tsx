"use client";

import React from 'react';
import EventCard from './event-card';
import { RingsIcon, PartyHatIcon } from './animated-icons';

interface DetailsSectionProps {
  onRsvpClick: () => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ onRsvpClick }) => {
  const ceremonyDetails = {
    title: 'Ceremonia',
    icon: <RingsIcon />,
    day: '08 de Agosto de 2026',
    time: '18:00',
    place: 'Parroquia Sagrado Corazón de Jesús',
    address: '(ver ubicación)',
    mapsLink: 'https://maps.app.goo.gl/CFG4xPPQNPtCyMJB8',
    calendar: {
      title: 'Ceremonia Álvaro y Carmen',
      description: 'Ceremonia de la boda de Álvaro y Carmen en la Parroquia Sagrado Corazón de Jesús.',
      location: 'Parroquia Sagrado Corazón de Jesús',
      startTime: new Date('2026-08-08T18:00:00'),
      endTime: new Date('2026-08-08T19:00:00'),
    },
    backgroundImage: '/iglesia.png',
  };

  const celebrationDetails = {
    title: 'Celebración',
    icon: <PartyHatIcon />,
    day: '08 de Agosto de 2026',
    time: '20:00',
    place: 'Convento de la Luz',
    address: '(ver ubicación)',
    mapsLink: 'https://maps.app.goo.gl/Ys8WecRhzFZYynvN9',
    calendar: {
      title: 'Celebración Boda Álvaro y Carmen',
      description: 'Celebración de la boda de Álvaro y Carmen en el Convento de la Luz.',
      location: 'Convento de la Luz, Brozas, Cáceres',
      startTime: new Date('2026-08-08T20:00:00'),
      endTime: new Date('2026-08-09T06:05:00'),
    },
    backgroundImage: '/convento.png',
  };

  return (
    <section id="detalles" className="py-16 sm:py-24 w-full">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
        <EventCard {...ceremonyDetails} onRsvpClick={onRsvpClick} />
        <EventCard {...celebrationDetails} onRsvpClick={onRsvpClick} />
      </div>
    </section>
  );
};

export default DetailsSection;
