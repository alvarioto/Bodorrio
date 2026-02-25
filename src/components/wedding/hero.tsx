"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Countdown from './countdown';
import { TopBotanicalDecoration } from './decorations';

const HeroSection = () => {
  return (
    <div className="relative w-full text-center pt-24 pb-24 sm:pt-32 sm:pb-32 md:pt-40 md:pb-48 rounded-t-[3rem] overflow-hidden">


      <div className="container mx-auto px-4 flex flex-col items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-8 sm:mb-12 relative"
        >


          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-[clamp(1.5rem,4vw,2rem)]"
          >
            <h3 className="font-headline text-[#4a6360] font-light inline-block px-4"
              style={{ fontSize: 'clamp(1.125rem, 3vw, 1.875rem)', letterSpacing: 'clamp(0.1em, 0.5vw, 0.2em)' }}>
              08 · 08 · 2026
            </h3>
          </motion.div>

          {/* Decorative Top Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            className="w-[70%] max-w-[250px] md:max-w-[350px] mx-auto h-px bg-[#4a6360]/30 relative z-10"
          />

          <h1 className="font-headline flex flex-col md:block items-center justify-center leading-tight relative"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              paddingTop: 'clamp(0.25rem, 1vw, 0.5rem)',
              paddingBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
              gap: 'clamp(0.25rem, 1vw, 1rem)'
            }}>

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block md:inline"
            >
              Carmen
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="ampersand inline-block"
              style={{
                margin: '0 clamp(0.5rem, 2vw, 1rem)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
              }}
            >
              &
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block md:inline"
            >
              Álvaro
            </motion.span>

          </h1>

          {/* Decorative Bottom Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            className="w-[70%] max-w-[250px] md:max-w-[350px] mx-auto h-px bg-[#4a6360]/30 mb-[clamp(1.5rem,4vw,2rem)]"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-headline mb-0 tracking-wide"
            style={{
              color: '#81948B',
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              marginTop: 'clamp(0.9375rem, 3vw, 1.25rem)'
            }}
          >
            ¡Nos casamos!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="max-w-4xl mx-auto text-muted-foreground leading-relaxed px-2"
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              marginTop: 'clamp(1.5rem, 4vw, 2rem)'
            }}
          >
            Con gran alegría queremos compartir este día tan especial con vosotros. <br className="hidden sm:block" />
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
