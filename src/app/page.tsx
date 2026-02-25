"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/wedding/hero';
import DetailsSection from '@/components/wedding/details';
import PhotosSection from '@/components/wedding/photos';
import RsvpModal from '@/components/wedding/rsvp-modal';
import LightboxModal from '@/components/wedding/lightbox-modal';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import TimelineSection from '@/components/wedding/timeline';
import InfoCardsSection from '@/components/wedding/info-cards';
import { WatercolorCorner } from '@/components/wedding/decorations';

import Footer from '@/components/wedding/footer';

export default function WeddingPage() {
  const [rsvpType, setRsvpType] = useState<'ceremony' | 'celebration' | null>(null);
  const [lightboxImage, setLightboxImage] = useState<ImagePlaceholder | null>(null);

  const handlePhotoClick = (image: ImagePlaceholder) => {
    setLightboxImage(image);
  };

  const isLightboxOpen = !!lightboxImage;
  const onLightboxOpenChange = (open: boolean) => {
    if (!open) {
      setLightboxImage(null);
    }
  };

  return (
    <main className="page-container flex-col !block">
      {/* !block overrides flex from global css if needed, or we adapt globals. 
          The original page-container had display:flex. 
          We want a column layout for the whole page. */}

      <div
        className="invitation-card mx-auto min-h-screen relative shadow-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/paper-texture.png')",
          backgroundSize: '100%',
          backgroundPosition: 'center',
        }}
      >
        {/* FLORAL CORNERS */}
        <WatercolorCorner position="top-left" className="top-0 left-0 w-[clamp(120px,25vw,400px)] h-[clamp(120px,25vw,400px)]" />
        <WatercolorCorner position="top-right" className="top-0 right-0 w-[clamp(120px,25vw,400px)] h-[clamp(120px,25vw,400px)]" />
        <WatercolorCorner position="bottom-left" className="bottom-0 left-0 w-[clamp(120px,25vw,400px)] h-[clamp(120px,25vw,400px)]" />
        <WatercolorCorner position="bottom-right" className="bottom-0 right-0 w-[clamp(120px,25vw,400px)] h-[clamp(120px,25vw,400px)]" />

        <div className="relative z-10 font-sans">
          <HeroSection />

          <div className="rounded-b-3xl">
            <DetailsSection onRsvpClick={(type) => setRsvpType(type)} />

            <section className="relative">
              <div className="card-content-wrapper py-12 sm:py-20">
                <TimelineSection />
              </div>
            </section>

            <div className="card-content-wrapper py-12">
              <PhotosSection onPhotoClick={handlePhotoClick} />
            </div>

            <div className="card-content-wrapper py-12">
              <InfoCardsSection />
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <RsvpModal
        isOpen={!!rsvpType}
        onOpenChange={(open) => !open && setRsvpType(null)}
        type={rsvpType}
      />
      <LightboxModal
        isOpen={isLightboxOpen}
        onOpenChange={onLightboxOpenChange}
        image={lightboxImage}
      />
    </main>
  );
}
