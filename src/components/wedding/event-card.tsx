"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createAndDownloadIcsFile } from '@/lib/calendar';

type EventCardProps = {
  title: string;
  icon: React.ReactNode;
  day: string;
  time: string;
  place: string;
  address: string;
  mapsLink: string;
  onRsvpClick: () => void;
  calendar: {
    title: string;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
  };
};

const EventCard: React.FC<EventCardProps> = ({
  title,
  icon,
  day,
  time,
  place,
  address,
  mapsLink,
  onRsvpClick,
  calendar,
}) => {
  const handleAddToCalendar = () => {
    createAndDownloadIcsFile(calendar);
  };

  return (
    <Card className="bg-card text-card-foreground rounded-3xl shadow-sm border-border overflow-hidden flex flex-col">
      <CardContent className="p-8 sm:p-12 flex-grow flex flex-col text-center items-center">
        <div className="mb-6 h-16 w-16 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-headline text-4xl mb-8">{title}</h3>
        
        <div className="space-y-6 text-muted-foreground flex-grow">
          <div>
            <p className="font-bold text-foreground">Día</p>
            <p>{day} - {time}</p>
          </div>
          <div>
            <p className="font-bold text-foreground">Lugar</p>
            <p>{place}</p>
          </div>
          <div>
            <p className="font-bold text-foreground">Dirección</p>
            <p>{address}</p>
          </div>
        </div>

        <div className="mt-10 w-full space-y-3 flex flex-col items-center">
          <Button onClick={handleAddToCalendar} className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all">
            Agendar
          </Button>
          <Button onClick={onRsvpClick} className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all">
            Confirmar asistencia
          </Button>
          <Button asChild className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer">
              ¿Cómo llegar?
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
