"use client";

import React from "react";
import EventCard from "./event-card";
import { RingsIcon, PartyHatIcon } from "./animated-icons";

interface DetailsSectionProps {
  onRsvpClick: () => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ onRsvpClick }) => {
  const iconClass = "text-primary";

  const ceremonyDetails = {
    title: "Ceremonia",
    icon: <RingsIcon size={51} className={iconClass} />,
    day: "08 de Agosto de 2026",
    time: "18:00",
    place: "Parroquia Sagrado Corazón de Jesús",
    address: "C. Presbítero Pablo Rodríguez, 3 Huelva",
    mapsLink: "https://maps.app.goo.gl/CFG4xPPQNPtCyMJB8",
    calendar: {
      title: "Ceremonia Carmen y Álvaro",
      description:
        "Ceremonia de la boda de Álvaro y Carmen en la Parroquia Sagrado Corazón de Jesús.",
      location: "C. Presbítero Pablo Rodríguez, 3 Huelva",
      startTime: new Date("2026-08-08T18:00:00"),
      endTime: new Date("2026-08-08T19:00:00"),
    },
  };

  const celebrationDetails = {
    title: "Celebración",
    icon: <PartyHatIcon size={51} className={iconClass} />,
    day: "08 de Agosto de 2026",
    time: "20:00",
    place: "Convento de la Luz",
    address: "Convento de la Luz, Lucena del Puerto, Huelva",
    mapsLink: "https://maps.app.goo.gl/Ys8WecRhzFZYynvN9",
    calendar: {
      title: "Celebración Boda Álvaro y Carmen",
      description: "Celebración de la boda de Álvaro y Carmen en el Convento de la Luz.",
      location: "Convento de la Luz, Lucena del Puerto, Huelva",
      startTime: new Date("2026-08-08T20:00:00"),
      endTime: new Date("2026-08-09T06:05:00"),
    },
  };

  return (
    <section 
      id="detalles" 
      className="w-full"
    >
      <div className="card-content-wrapper py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-12 justify-center items-stretch">
          {/* Columna Derecha: Ceremonia y Celebración */}
          <div className="w-full">
            <div className="space-y-12 h-full flex flex-col lg:flex-row gap-12 justify-between">
              <div
                className="w-full bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(/iglesia.png)` }}
              >
                <div className="p-8 flex justify-center">
                  <EventCard {...ceremonyDetails} onRsvpClick={onRsvpClick} />
                </div>
              </div>

              <div
                className="w-full bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(/convento.png)` }}
              >
                <div className="p-8 flex justify-center">
                  <EventCard {...celebrationDetails} onRsvpClick={onRsvpClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
