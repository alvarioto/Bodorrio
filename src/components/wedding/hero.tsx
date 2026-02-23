"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Countdown from './countdown';
import { TopBotanicalDecoration } from './decorations';

const HeroSection = () => {
  return (
    <div className="relative w-full text-center pt-32 pb-32 md:pt-40 md:pb-48 rounded-t-[3rem] overflow-hidden">


      <div className="container mx-auto px-4 flex flex-col items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12 relative"
        >


          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h3 className="font-headline text-xl md:text-3xl text-[#4a6360] tracking-[0.2em] font-light inline-block px-4">
              08 · 08 · 2026
            </h3>
          </motion.div>

          <h1 className="font-headline text-5xl md:text-[90px] flex flex-col md:block items-center justify-center gap-2 md:gap-4 leading-tight border-y border-[#4a6360]/30 py-4 md:py-6 mb-8">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block md:inline"
            >
              Álvaro
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="ampersand mx-4"
            >
              &
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block md:inline"
            >
              Carmen
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-headline mt-[20px] mb-0 tracking-wide text-[40px]"
            style={{ color: '#81948B' }}
          >
            ¡Nos casamos!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="max-w-4xl mx-auto text-muted-foreground mt-8 leading-relaxed text-[22px]"
          >
            Con gran alegría queremos compartir este día tan especial con vosotros. <br />
            Vuestra presencia es nuestro mejor regalo.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full"
        >
          <h4 className="text-muted-foreground tracking-[0.3em] uppercase text-sm mb-6 font-semibold">
            ¡Solo Faltan!
          </h4>
          <Countdown />
        </motion.div>
      </div>


    </div>
  );
};

export default HeroSection;
