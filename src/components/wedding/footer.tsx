"use client";

import React from 'react';
import Link from 'next/link';
import { exportGuestsToCSV } from '@/services/rsvp';
import { Lock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FooterBotanicalDivider } from './decorations';

export default function Footer() {
    const handleExport = async () => {
        // Legacy export function - kept for reference but UI now redirects to /admin
        await exportGuestsToCSV();
    };

    return (
        <footer className="w-full py-12 pb-8 text-center text-muted-foreground relative mt-24 rounded-t-[3rem] bg-gradient-to-b from-transparent to-primary/5">

            <div className="container mx-auto px-4 flex flex-col items-center">
                {/* Main Footer Content */}
                <div className="flex flex-col items-center gap-6 mb-16">
                    <h2 className="font-headline text-4xl text-primary/80">Carmen & Álvaro</h2>
                    <p className="tracking-[0.2em] uppercase text-sm font-medium text-primary/60 border-y border-primary/20 py-2 px-6">
                        08 · 08 · 2026
                    </p>
                </div>

                {/* Bottom Credits / "Official Style" */}
                <div className="w-full max-w-2xl border-t border-primary/10 pt-8 flex flex-col items-center gap-4">
                    <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5 font-light tracking-wide">
                        Creado con <Heart className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse" /> por Carmen y Álvaro
                    </p>

                    <div className="flex justify-center">
                        <Link href="/admin">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-40 hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
                                title="Admin Zone"
                            >
                                <Lock className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
