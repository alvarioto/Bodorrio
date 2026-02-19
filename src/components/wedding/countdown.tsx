"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = () => {
    const weddingDate = new Date('2026-08-08T18:00:00');
    const [timeLeft, setTimeLeft] = useState({
        días: 0,
        horas: 0,
        min: 0,
        seg: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = weddingDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    días: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    min: Math.floor((difference / 1000 / 60) % 60),
                    seg: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [weddingDate]);

    return (
        <div className="flex justify-center gap-4 md:gap-8 text-center">
            {Object.entries(timeLeft).map(([unit, value], index) => (
                <motion.div
                    key={unit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex flex-col items-center min-w-[70px] md:min-w-[90px]"
                >
                    <span className="font-headline text-3xl md:text-5xl text-primary font-bold">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1 font-nunito font-bold">
                        {unit}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

export default Countdown;
