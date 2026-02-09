"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import type { BaseIconProps } from "./animated-icons";
import {
  CeremonyIcon,
  DinnerIcon,
  LordiconClinkingGlasses,
  PartyIcon,
  FadingPartyIcon,
  AnimatedBusIcon,
} from "./animated-icons";

/* =======================================================================================
 * TIPOS
 * ======================================================================================= */

type IconComponent = React.ComponentType<BaseIconProps>;

type TimelineEvent = {
  time: string;
  title: string;
  Icon: IconComponent;

  // Control simple por evento (tamaño burbuja y icono + offsets)
  bubbleSize?: number;
  iconSize?: number;
  iconOffsetX?: number;
  iconOffsetY?: number;
};

/* =======================================================================================
 * DATOS DE LA CRONOLOGÍA (lista de eventos)
 * ======================================================================================= */

const timelineEvents: TimelineEvent[] = [
  { time: "18:00", title: "Ceremonia", Icon: CeremonyIcon, bubbleSize: 52, iconSize: 36, iconOffsetY: 0 },
  { time: "19:30", title: "Salida del autobús", Icon: AnimatedBusIcon, bubbleSize: 52, iconSize: 36, iconOffsetY: 2 },
  { time: "20:00", title: "Recepción", Icon: LordiconClinkingGlasses, bubbleSize: 52, iconSize: 36 },
  { time: "22:00", title: "Cena", Icon: DinnerIcon, bubbleSize: 52, iconSize: 32 },
  { time: "01:00", title: "¡Fiesta!", Icon: PartyIcon, bubbleSize: 52, iconSize: 36, iconOffsetY: -2 },
  { time: "03:00", title: "Salida primer autobús", Icon: AnimatedBusIcon, bubbleSize: 52, iconSize: 36 },
  { time: "06:00", title: "Fin de fiesta", Icon: FadingPartyIcon, bubbleSize: 52, iconSize: 36, iconOffsetY: -2 },
  { time: "06:05", title: "Salida último autobús", Icon: AnimatedBusIcon, bubbleSize: 52, iconSize: 36 },
];

/* =======================================================================================
 * ITEM (una fila del timeline)
 * - Aparece con animación cuando entra en pantalla (IntersectionObserver)
 * - Alterna izquierda/derecha
 * ======================================================================================= */

function TimelineItem({
  time,
  title,
  Icon,
  isRight,
  bubbleSize = 52,
  iconSize = 32,
  iconOffsetX = 0,
  iconOffsetY = 0,
}: TimelineEvent & { isRight: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative flex items-center group transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Texto a izquierda / derecha */}
      {isRight ? (
        <>
          <div className="w-1/2" />
          <div
            className={cn(
              "w-1/2 pl-12 flex justify-start items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "-translate-x-10"
            )}
          >
            <div className="text-left">
              <p className="font-bold text-sm text-primary">{time}</p>
              <h4 className="font-headline mt-1 text-xl">{title}</h4>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              "w-1/2 pr-12 flex justify-end items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "translate-x-10"
            )}
          >
            <div className="text-right">
              <p className="font-bold text-sm text-primary">{time}</p>
              <h4 className="font-headline mt-1 text-xl">{title}</h4>
            </div>
          </div>
          <div className="w-1/2" />
        </>
      )}

      {/* Burbuja del icono en el centro */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-500 ease-out",
          isVisible ? "scale-100" : "scale-0"
        )}
        style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
        aria-hidden="true"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-full bg-secondary border-2 border-primary shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          )}
          style={{ width: bubbleSize, height: bubbleSize }}
        >
          <Icon
            size={iconSize}
            style={{ transform: `translate(${iconOffsetX}px, ${iconOffsetY}px)` }}
            className="text-primary"
          />
        </div>
      </div>
    </div>
  );
}

/* =======================================================================================
 * SECCIÓN COMPLETA
 * ======================================================================================= */

export default function TimelineSection() {
  return (
    <section id="itinerario" className="py-12 sm:py-20 w-full overflow-x-hidden">
      <div className="text-center mb-10">
        <h2 className="font-headline text-3xl">Itinerario de nuestra boda</h2>
        <p className="text-muted-foreground mt-2 text-sm">El plan para nuestro gran día.</p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-primary/50" />

        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <TimelineItem
              key={`${event.time}-${event.title}`}
              {...event}
              isRight={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
