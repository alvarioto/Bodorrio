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
  { time: "18:00", title: "Ceremonia", Icon: CeremonyIcon, bubbleSize: 67, iconSize: 48, iconOffsetY: 0 },
  { time: "19:30", title: "Salida del autobús", Icon: AnimatedBusIcon, bubbleSize: 67, iconSize: 84, iconOffsetY: 2 },

  { time: "20:00", title: "Recepción", Icon: LordiconClinkingGlasses, bubbleSize: 67, iconSize: 42 },
  { time: "22:00", title: "Cena", Icon: DinnerIcon, bubbleSize: 67, iconSize: 58 },
  { time: "01:00", title: "¡Fiesta!", Icon: PartyIcon, bubbleSize: 67, iconSize: 53, iconOffsetY: -2 },
  { time: "03:00", title: "Salida primer autobús", Icon: AnimatedBusIcon, bubbleSize: 67, iconSize: 84 },

  { time: "06:00", title: "Fin de fiesta", Icon: FadingPartyIcon, bubbleSize: 67, iconSize: 53, iconOffsetY: -2 },
  { time: "06:05", title: "Salida último autobús", Icon: AnimatedBusIcon, bubbleSize: 67, iconSize: 84 },

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
  isFirst,
  isLast,
  bubbleSize = 56,
  iconSize = 36,
  iconOffsetX = 0,
  iconOffsetY = 0,
}: TimelineEvent & { isRight: boolean; isFirst: boolean; isLast: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top > 0) {
            setIsVisible(entry.isIntersecting);
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
        "relative flex items-center group transition-opacity duration-1000 py-12", // Changed to balanced py-12 (3rem top + 3rem bottom = 6rem gap total between centers)
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* LÍNEA CONECTORA */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 w-px bg-primary/50 -z-10",
          isFirst ? "top-1/2 h-1/2" : // Primero: mitad inferior
            isLast ? "top-0 h-1/2" :    // Último: mitad superior
              "top-0 h-full"              // Intermedios: completo
        )}
      />

      {/* Texto a izquierda / derecha */}
      {isRight ? (
        <>
          <div className="w-1/2" />
          <div
            className={cn(
              "w-1/2 pl-16 flex justify-start items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "-translate-x-10"
            )}
          >
            <div className="text-left">
              <p className="font-bold text-base text-primary">{time}</p>
              <h4 className="font-headline mt-1 text-xl">{title}</h4>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              "w-1/2 pr-16 flex justify-end items-center transition-transform duration-700 ease-out",
              isVisible ? "translate-x-0" : "translate-x-10"
            )}
          >
            <div className="text-right">
              <p className="font-bold text-base text-primary">{time}</p>
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
    <div id="itinerario" className="w-full flex flex-col text-foreground overflow-x-hidden pb-16">
      <div className="p-6">
        <div className="w-full">
          <div className="text-center mb-10">
            <h2 className="font-headline text-[32px]">Itinerario de nuestra boda</h2>
            <p className="text-muted-foreground mt-2 text-lg">El plan para nuestro gran día.</p>
          </div>

          <div className="relative">
            {/* Eliminada línea global y space-y-24 */}
            <div className="flex flex-col">
              {timelineEvents.map((event, index) => (
                <TimelineItem
                  key={`${event.time}-${event.title}`}
                  {...event}
                  isRight={index % 2 !== 0}
                  isFirst={index === 0}
                  isLast={index === timelineEvents.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
