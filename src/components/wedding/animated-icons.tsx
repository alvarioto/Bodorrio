"use client";

import { cn } from "@/lib/utils";
import React from "react";

const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "hsl(140, 8%, 25%)",
  strokeWidth: "2.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const RingsIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .ring-1 { --ring-translate-x: -2px; --ring-rotate: -6deg; animation: ring-move 3s ease-in-out infinite; }
      .ring-2 { --ring-translate-x: 2px; --ring-rotate: 6deg; animation: ring-move 3s ease-in-out infinite; }
      .heart { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw-heart 0.7s ease-out forwards 1.05s, undraw-heart 0.7s ease-out forwards 2.1s; animation-iteration-count: infinite; }
    `}</style>
    <circle className="ring-1" cx="26" cy="30" r="10" />
    <circle className="ring-2" cx="38" cy="30" r="10" />
    <path className="heart" d="M20 40.5C22.5 44 26 42.5 26 40.5C26 38.5 24 38.5 22 40.5C20 42.5 17.5 44 20 40.5Z" />
    <path className="heart" d="M44 40.5C41.5 44 38 42.5 38 40.5C38 38.5 40 38.5 42 40.5C44 42.5 46.5 44 44 40.5Z" style={{ animationDelay: '1.15s, 2.2s' }}/>
  </svg>
);

export const PartyHatIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .hat { animation: party-hat-bounce 2.6s ease-in-out infinite; }
      .confetti { animation: confetti-fade 2.6s ease-in-out infinite; }
    `}</style>
    <path className="hat" d="M23 48L32 20L41 48Z" />
    <path className="hat" d="M23 48C25 50 29 50 32 48S39 46 41 48" />
    <path className="confetti" d="M45 28L48 25" style={{ animationDelay: '0.2s' }} />
    <path className="confetti" d="M19 28L16 25" />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg {...commonProps} className={cn("w-14 h-14", className)}>
    <style>{`
      .flash { animation: camera-flash 2.8s ease-in-out infinite; opacity: 0; }
      .lens { animation: camera-lens-pulse 2.8s ease-in-out infinite; transform-origin: center; }
    `}</style>
    <rect x="12" y="24" width="40" height="24" rx="4" />
    <circle className="lens" cx="32" cy="36" r="8" />
    <path className="flash" d="M28 20L24 14L32 14L28 20Z" fill="hsl(140, 8%, 25%)" stroke="none" />
    <path d="M18 24V22" />
  </svg>
);

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-secondary border border-primary shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
    {children}
  </div>
);

export const BusIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-move_2s_ease-in-out_infinite]">
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" className="animate-[wheels-rotate_1s_linear_infinite]" />
            <circle cx="44" cy="48" r="4" className="animate-[wheels-rotate_1s_linear_infinite]" />
        </svg>
    </IconWrapper>
);

export const DrinksIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
            <path d="M20 28L30 18L40 28" className="animate-[cup-clink_2s_ease-in-out_infinite]" style={{'--cup-rotate': '-5deg'} as React.CSSProperties}/>
            <path d="M30 28V46" />
            <path d="M24 46H36" />
            <path d="M44 28L34 18L24 28" className="animate-[cup-clink_2s_ease-in-out_infinite]" style={{'--cup-rotate': '5deg'} as React.CSSProperties}/>
            <path d="M34 28V46" />
            <path d="M28 46H40" />
            <path d="M32 16L32 12" className="animate-[confetti-fade_2s_ease-in-out_infinite]"/>
        </svg>
    </IconWrapper>
);

export const DinnerIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
            <circle cx="32" cy="36" r="14" />
            <path d="M20,20 L44,44" strokeDasharray="40" className="animate-[shine-effect_2s_ease-in-out_infinite]"/>
            <path d="M18 20V52" />
            <path d="M46 20V52" />
        </svg>
    </IconWrapper>
);

export const PartyIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[disco-rotate_5s_linear_infinite]">
            <circle cx="32" cy="32" r="14" />
            <path d="M18 32H46" />
            <path d="M32 18V46" />
            <path d="M21.6 21.6L42.4 42.4" />
            <path d="M21.6 42.4L42.4 21.6" />
        </svg>
    </IconWrapper>
);

export const EndOfPartyIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28">
             <path d="M22 22 L42 42 M22 42 L42 22" className="animate-[confetti-fade_3s_ease-in-out_infinite_reverse]"/>
        </svg>
    </IconWrapper>
);


export const NightBusIcon = () => (
    <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-move_4s_ease-in-out_infinite]">
            <path d="M48 20 A10 10 0 1 0 48 21" stroke="hsl(130, 20%, 65%)" />
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" className="animate-[wheels-rotate_2s_linear_infinite]" />
            <circle cx="44" cy="48" r="4" className="animate-[wheels-rotate_2s_linear_infinite]" />
        </svg>
    </IconWrapper>
);

export const BusAwayIcon = () => (
     <IconWrapper>
        <svg {...commonProps} width="28" height="28" className="animate-[bus-away_4s_ease-in-out_forwards]">
            <rect x="12" y="24" width="40" height="18" rx="4" />
            <path d="M12 32H52" />
            <circle cx="20" cy="48" r="4" />
            <circle cx="44" cy="48" r="4" />
        </svg>
    </IconWrapper>
)
