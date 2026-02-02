"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ClinkingGlassesIcon, DinnerIcon, PartyIcon, EndOfPartyIcon, RingsIcon } from './animated-icons';

const TimelineIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-background border-2 border-primary shadow-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105 z-10">
    {children}
  </div>
);

const AnimatedBusIcon = () => (
    <>
        <style>{`
            @keyframes drive {
                0%   { transform: translateX(-10px) translateY(0px) rotate(-1deg); }
                25%  { transform: translateX(-2px)  translateY(1px) rotate(0deg); }
                50%  { transform: translateX(10px)  translateY(0px) rotate(1deg); }
                75%  { transform: translateX(2px)   translateY(1px) rotate(0deg); }
                100% { transform: translateX(-10px) translateY(0px) rotate(-1deg); }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .busMoveAnimate {
                transform-box: fill-box;
                transform-origin: center;
                animation: drive 1.6s ease-in-out infinite;
            }
            .wheelAnimate {
                transform-box: fill-box;
                transform-origin: center;
                animation: spin .45s linear infinite;
            }
            @media (prefers-reduced-motion: reduce){
                .busMoveAnimate, .wheelAnimate { animation: none !important; }
            }
        `}</style>
        <svg
            className="w-20 h-20 text-foreground"
            viewBox="-20 -20 552 552"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Autobús animado"
            role="img">
            <g className="busMoveAnimate">
                <g transform="translate(0,512) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                    <path d="M89 3931 c-31 -19 -53 -44 -68 -73 l-21 -45 2 -1021 3 -1020 30 -43 c51 -72 86 -83 266 -87 l155 -4 12 -54 c39 -186 208 -359 398 -408 78 -20 212 -21 287 -1 200 52 354 212 407 423 l11 42 852 0 853 0 11 -53 c39 -188 208 -362 399 -411 78 -20 212 -21 287 -1 200 52 354 212 407 423 l11 42 192 0 c110 0 209 5 232 11 55 15 120 82 135 139 9 33 11 136 7 385 -5 377 -13 444 -74 645 -65 212 -153 513 -153 522 0 4 33 8 73 8 l73 0 52 -164 c54 -172 69 -196 120 -196 28 0 72 42 72 68 0 11 -27 104 -60 208 -78 244 -67 234 -245 234 -119 0 -134 2 -139 18 -40 140 -71 225 -94 262 -39 61 -103 117 -171 149 l-56 26 -2110 3 -2111 2 -45 -29z m4248 -136 c52 -22 100 -61 118 -96 l16 -29 -2161 0 -2160 0 0 58 c0 32 5 63 12 70 9 9 484 12 2075 12 1830 0 2068 -2 2100 -15z m-3727 -630 l0 -355 -230 0 -230 0 0 355 0 355 230 0 230 0 0 -355z m290 0 l0 -355 -70 0 -70 0 0 355 0 355 70 0 70 0 0 -355z m660 0 l0 -355 -255 0 -255 0 0 355 0 355 255 0 255 0 0 -355z m280 0 l0 -355 -65 0 -65 0 0 355 0 355 65 0 65 0 0 -355z m668 3 l-3 -353 -255 0 -255 0 -3 353 -2 352 260 0 260 0 -2 -352z m282 253 c0 -55 3 -107 6 -116 10 -24 60 -46 89 -39 45 11 55 39 55 151 l0 103 255 0 255 0 0 -355 0 -355 -255 0 -255 0 0 102 c0 91 -2 104 -22 125 -30 33 -80 31 -107 -3 -18 -23 -21 -41 -21 -125 l0 -99 -65 0 -65 0 0 355 0 355 65 0 65 0 0 -99z m950 -256 l0 -356 -67 3 -68 3 -3 353 -2 352 70 0 70 0 0 -355z m799 288 c11 -38 61 -207 112 -378 122 -410 138 -473 146 -572 l6 -83 -214 0 c-181 0 -220 3 -250 18 -20 9 -129 91 -243 182 l-206 165 0 368 0 367 315 0 314 0 20 -67z m-698 -822 c24 -15 64 -47 89 -69 l45 -41 -719 -1 -720 0 -23 -22 c-28 -26 -30 -67 -4 -99 l19 -24 821 -3 821 -2 46 -35 c75 -57 119 -65 371 -65 l223 0 0 -218 c0 -181 -3 -221 -16 -240 -15 -21 -20 -22 -209 -22 l-195 0 -6 28 c-26 124 -74 214 -160 298 -202 201 -529 217 -746 37 -94 -77 -166 -193 -193 -308 l-12 -50 -851 -3 -852 -2 -6 27 c-18 83 -51 159 -95 222 -170 242 -492 310 -752 158 -112 -66 -222 -218 -252 -349 l-11 -53 -136 -3 c-114 -2 -139 0 -152 13 -14 14 -16 53 -16 291 l0 274 1035 0 c736 0 1041 3 1058 11 24 11 47 47 47 73 0 7 -9 25 -21 40 l-20 26 -1050 0 -1049 0 0 70 0 70 1823 0 1823 0 45 -29z m-2726 -517 c119 -30 216 -111 269 -224 39 -83 48 -208 21 -291 -36 -113 -116 -204 -224 -256 -79 -38 -220 -45 -302 -14 -166 63 -264 193 -276 367 -9 125 36 234 132 322 109 100 240 133 380 96z m2820 0 c120 -31 215 -110 268 -222 30 -63 32 -74 32 -177 0 -101 -2 -115 -29 -170 -38 -77 -124 -163 -201 -200 -84 -40 -223 -47 -307 -15 -161 60 -263 193 -275 360 -10 126 36 241 132 328 109 100 240 133 380 96z" />
                    <path className="wheelAnimate" d="M931 2025 c-70 -20 -111 -46 -160 -101 -135 -154 -86 -393 102 -491 45 -24 64 -28 137 -28 73 0 93 4 142 28 63 31 116 86 150 156 33 65 32 185 -1 258 -27 61 -103 136 -164 163 -61 27 -142 32 -206 15z m121 -145 c148 -41 172 -236 38 -307 -71 -38 -138 -28 -196 29 -87 83 -53 233 61 273 49 17 51 17 97 5z" />
                    <path className="wheelAnimate" d="M3751 2025 c-70 -20 -111 -46 -160 -101 -135 -154 -85 -393 102 -492 45 -23 64 -27 137 -27 73 0 93 4 142 28 63 31 116 86 150 156 33 65 32 185 -1 258 -27 61 -103 136 -164 163 -61 27 -142 32 -206 15z m122 -146 c50 -13 103 -61 118 -106 25 -77 -14 -172 -85 -204 -72 -33 -136 -22 -192 33 -87 83 -53 233 61 273 49 17 51 17 98 4z" />
                </g>
            </g>
        </svg>
    </>
);

const timelineEvents = [
  { time: '18:00', title: 'Ceremonia', icon: <TimelineIconWrapper><RingsIcon className="w-16 h-16" /></TimelineIconWrapper> },
  { time: '19:30', title: 'Salida del autobús', icon: <TimelineIconWrapper><AnimatedBusIcon /></TimelineIconWrapper> },
  { time: '20:00', title: 'Recepción', icon: <TimelineIconWrapper><ClinkingGlassesIcon className="w-16 h-16"/></TimelineIconWrapper> },
  { time: '22:00', title: 'Cena', icon: <TimelineIconWrapper><DinnerIcon /></TimelineIconWrapper> },
  { time: '01:00', title: '¡Fiesta!', icon: <TimelineIconWrapper><PartyIcon /></TimelineIconWrapper> },
  { time: '03:00', title: 'Salida primer autobús', icon: <TimelineIconWrapper><AnimatedBusIcon /></TimelineIconWrapper> },
  { time: '06:00', title: 'Fin de fiesta', icon: <TimelineIconWrapper><EndOfPartyIcon /></TimelineIconWrapper> },
  { time: '06:05', title: 'Salida último autobús', icon: <TimelineIconWrapper><AnimatedBusIcon /></TimelineIconWrapper> },
];

const TimelineItem = ({ time, title, icon, isRight }: { time: string, title: string, icon: React.ReactNode, isRight: boolean }) => (
    <div className="relative flex items-center w-full">
        {isRight ? (
            <>
                <div className="w-1/2 flex justify-end pr-10 md:pr-16" />
                <div className="absolute left-1/2 -translate-x-1/2 z-10">{icon}</div>
                <div className="w-1/2 pl-10 md:pl-16">
                    <p className="font-bold text-xl md:text-2xl text-primary">{time}</p>
                    <h4 className="font-headline text-4xl md:text-5xl mt-2">{title}</h4>
                </div>
            </>
        ) : (
            <>
                <div className="w-1/2 flex justify-end pr-10 md:pr-16 text-right">
                    <div>
                        <p className="font-bold text-xl md:text-2xl text-primary">{time}</p>
                        <h4 className="font-headline text-4xl md:text-5xl mt-2">{title}</h4>
                    </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 z-10">{icon}</div>
                <div className="w-1/2 pl-10 md:pl-16" />
            </>
        )}
    </div>
);

const TimelineSection = () => {
  return (
    <section id="cronologia" className="py-24 sm:py-32 w-full">
      <div className="text-center mb-24">
        <h2 className="font-headline text-7xl md:text-8xl">Cronología</h2>
        <p className="text-muted-foreground mt-4 text-lg">El plan para nuestro gran día.</p>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-primary/50" />
        <div className="space-y-20">
          {timelineEvents.map((event, index) => (
            <TimelineItem
              key={index}
              {...event}
              isRight={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
