"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createAndDownloadIcsFile } from '@/lib/calendar';
import { cn } from '@/lib/utils';

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
    <Card 
      className="bg-card/80 backdrop-blur-md text-card-foreground flex flex-col border-border/80 shadow-lg rounded-2xl w-full max-w-sm"
    >
      <CardContent className="p-6 flex-grow flex flex-col text-center items-center relative">
        <div className="mb-2 h-16 w-16 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-headline mb-4">{title}</h3>
        
        <div className="w-full space-y-4 text-muted-foreground flex-grow flex flex-col items-center">
          <div className="w-full">
            <p className="font-bold text-foreground">Día</p>
            <p>{day} - {time}</p>
            <Button onClick={handleAddToCalendar} className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all mt-3">
              Agendar
            </Button>
          </div>
          <div className="w-full">
            <p className="font-bold text-foreground">Lugar</p>
            <p>{place}</p>
            <Button onClick={onRsvpClick} className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all mt-3">
              Confirmar asistencia
            </Button>
          </div>
          <div className="w-full">
            <p className="font-bold text-foreground">Dirección</p>
            <p>{address}</p>
            <Button asChild className="w-full max-w-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all mt-3">
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                ¿Cómo llegar?
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
