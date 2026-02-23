import React from 'react';
import Image from 'next/image';

export const TopBotanicalDecoration = ({ className = "" }: { className?: string }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 800 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Left branch cluster */}
            <g opacity="0.6">
                {/* Main stems */}
                <path d="M150 80 Q180 60, 200 50 Q220 40, 240 45" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M160 82 Q185 65, 205 55" stroke="currentColor" strokeWidth="0.8" fill="none" />

                {/* Leaves - elongated ellipses */}
                <ellipse cx="170" cy="70" rx="3" ry="12" fill="currentColor" opacity="0.3" transform="rotate(-35 170 70)" />
                <ellipse cx="190" cy="58" rx="4" ry="14" fill="currentColor" opacity="0.3" transform="rotate(-40 190 58)" />
                <ellipse cx="210" cy="48" rx="3" ry="11" fill="currentColor" opacity="0.3" transform="rotate(-50 210 48)" />
                <ellipse cx="230" cy="42" rx="3.5" ry="13" fill="currentColor" opacity="0.3" transform="rotate(-45 230 42)" />

                {/* Flower - simple petals */}
                <circle cx="195" cy="52" r="1.5" fill="currentColor" opacity="0.4" />
                <ellipse cx="195" cy="48" rx="3" ry="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="198" cy="52" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="195" cy="56" rx="3" ry="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="192" cy="52" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
            </g>

            {/* Center cluster */}
            <g opacity="0.6">
                <path d="M380 85 L380 45" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M390 82 L390 50" stroke="currentColor" strokeWidth="0.8" fill="none" />
                <path d="M410 80 L410 48" stroke="currentColor" strokeWidth="0.8" fill="none" />

                {/* Wheat-like elements */}
                <ellipse cx="378" cy="50" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(-20 378 50)" />
                <ellipse cx="376" cy="55" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(20 376 55)" />
                <ellipse cx="378" cy="60" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(-20 378 60)" />
                <ellipse cx="376" cy="65" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(20 376 65)" />

                <ellipse cx="392" cy="55" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(-15 392 55)" />
                <ellipse cx="390" cy="60" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(15 390 60)" />
                <ellipse cx="392" cy="65" rx="2" ry="4" fill="currentColor" opacity="0.25" transform="rotate(-15 392 65)" />
            </g>

            {/* Right branch cluster - mirror of left */}
            <g opacity="0.6">
                <path d="M650 80 Q620 60, 600 50 Q580 40, 560 45" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M640 82 Q615 65, 595 55" stroke="currentColor" strokeWidth="0.8" fill="none" />

                <ellipse cx="630" cy="70" rx="3" ry="12" fill="currentColor" opacity="0.3" transform="rotate(35 630 70)" />
                <ellipse cx="610" cy="58" rx="4" ry="14" fill="currentColor" opacity="0.3" transform="rotate(40 610 58)" />
                <ellipse cx="590" cy="48" rx="3" ry="11" fill="currentColor" opacity="0.3" transform="rotate(50 590 48)" />
                <ellipse cx="570" cy="42" rx="3.5" ry="13" fill="currentColor" opacity="0.3" transform="rotate(45 570 42)" />

                {/* Flower */}
                <circle cx="605" cy="52" r="1.5" fill="currentColor" opacity="0.4" />
                <ellipse cx="605" cy="48" rx="3" ry="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="608" cy="52" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="605" cy="56" rx="3" ry="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                <ellipse cx="602" cy="52" rx="5" ry="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
            </g>

            {/* Small dots scattered */}
            <circle cx="250" cy="60" r="1" fill="currentColor" opacity="0.2" />
            <circle cx="280" cy="70" r="0.8" fill="currentColor" opacity="0.2" />
            <circle cx="320" cy="65" r="1" fill="currentColor" opacity="0.2" />
            <circle cx="480" cy="65" r="1" fill="currentColor" opacity="0.2" />
            <circle cx="520" cy="70" r="0.8" fill="currentColor" opacity="0.2" />
            <circle cx="550" cy="60" r="1" fill="currentColor" opacity="0.2" />
        </svg>
    );
};

export const FooterBotanicalDivider = ({ className = "" }: { className?: string }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 600 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Center element */}
            <circle cx="300" cy="40" r="2.5" fill="currentColor" opacity="0.4" />

            {/* Left spreading branch */}
            <g opacity="0.6">
                <path d="M300 40 Q270 38, 240 42 Q210 46, 180 42" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M298 42 Q275 40, 245 44" stroke="currentColor" strokeWidth="0.7" fill="none" />

                {/* Leaves on left branch */}
                <ellipse cx="280" cy="35" rx="3" ry="9" fill="currentColor" opacity="0.25" transform="rotate(-25 280 35)" />
                <ellipse cx="260" cy="40" rx="3.5" ry="10" fill="currentColor" opacity="0.25" transform="rotate(-15 260 40)" />
                <ellipse cx="240" cy="47" rx="3" ry="8" fill="currentColor" opacity="0.25" transform="rotate(20 240 47)" />
                <ellipse cx="220" cy="45" rx="3.5" ry="9" fill="currentColor" opacity="0.25" transform="rotate(-10 220 45)" />
                <ellipse cx="200" cy="42" rx="3" ry="8" fill="currentColor" opacity="0.25" transform="rotate(-20 200 42)" />
            </g>

            {/* Right spreading branch */}
            <g opacity="0.6">
                <path d="M300 40 Q330 38, 360 42 Q390 46, 420 42" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M302 42 Q325 40, 355 44" stroke="currentColor" strokeWidth="0.7" fill="none" />

                {/* Leaves on right branch */}
                <ellipse cx="320" cy="35" rx="3" ry="9" fill="currentColor" opacity="0.25" transform="rotate(25 320 35)" />
                <ellipse cx="340" cy="40" rx="3.5" ry="10" fill="currentColor" opacity="0.25" transform="rotate(15 340 40)" />
                <ellipse cx="360" cy="47" rx="3" ry="8" fill="currentColor" opacity="0.25" transform="rotate(-20 360 47)" />
                <ellipse cx="380" cy="45" rx="3.5" ry="9" fill="currentColor" opacity="0.25" transform="rotate(10 380 45)" />
                <ellipse cx="400" cy="42" rx="3" ry="8" fill="currentColor" opacity="0.25" transform="rotate(20 400 42)" />
            </g>

            {/* Small decorative dots */}
            <circle cx="290" cy="35" r="1" fill="currentColor" opacity="0.3" />
            <circle cx="310" cy="35" r="1" fill="currentColor" opacity="0.3" />
            <circle cx="250" cy="42" r="0.8" fill="currentColor" opacity="0.25" />
            <circle cx="350" cy="42" r="0.8" fill="currentColor" opacity="0.25" />
        </svg>
    );
};

export const WatercolorCorner = ({ position = "top-left", className = "" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right", className?: string }) => {
    // The native image floral-corner-v2 is a BOTTOM-RIGHT floral border.
    let scaleTransform = "scale(1, 1)";
    if (position === "top-left") scaleTransform = "scale(-1, -1)";
    if (position === "top-right") scaleTransform = "scale(1, -1)";
    if (position === "bottom-left") scaleTransform = "scale(-1, 1)";

    return (
        <div
            className={`absolute pointer-events-none z-0 ${className}`}
            style={{
                mixBlendMode: 'multiply',
                opacity: 0.85,
                transform: scaleTransform,
                transformOrigin: "center"
            }}
        >
            <Image
                src="/floral-corner-v2.png"
                alt="Decoración floral"
                fill
                className="object-contain object-right-bottom"
                priority
            />
        </div>
    );
};

export const WatercolorDivider = ({ className = "" }: { className?: string }) => {
    return (
        <div
            className={`relative flex justify-center items-center pointer-events-none z-0 ${className}`}
            style={{ mixBlendMode: 'multiply', opacity: 0.85 }}
        >
            {/* We use two corners mirrored facing each other to create a beautiful divider */}
            <div className="relative w-1/2 h-full">
                <Image src="/floral-corner-v2.png" alt="Floral decor" fill className="object-contain object-right-top rotate-45 scale-x-[-1]" />
            </div>
            <div className="relative w-1/2 h-full">
                <Image src="/floral-corner-v2.png" alt="Floral decor" fill className="object-contain object-left-top -rotate-45" />
            </div>
        </div>
    );
};
