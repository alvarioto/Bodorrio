"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/wedding/hero';
import DetailsSection from '@/components/wedding/details';
import TimelineSection from '@/components/wedding/timeline';
import RsvpModal from '@/components/wedding/rsvp-modal';

export default function WeddingPage() {
  const [isRsvpOpen, setRsvpOpen] = useState(false);

  return (
    <main className="page-container">
      <div className="invitation-card">
        <HeroSection />

        <div className="bg-card rounded-b-2xl">
          <DetailsSection onRsvpClick={() => setRsvpOpen(true)} />

          <div className="card-content-wrapper">
            <TimelineSection />
          </div>
          <div className="h-12 md:h-24" />
        </div>
      </div>

      <RsvpModal isOpen={isRsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}
