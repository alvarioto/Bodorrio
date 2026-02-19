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
        className="invitation-card mx-auto min-h-screen relative shadow-2xl"
        style={{
          backgroundImage: "url('/paper-texture.png')",
          backgroundSize: '100%',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 font-sans">
          <HeroSection />

          <div className="rounded-b-3xl">
            <DetailsSection onRsvpClick={(type) => setRsvpType(type)} />

            <section className="relative">
              <div className="card-content-wrapper py-16 sm:py-24">
                <TimelineSection />
              </div>
            </section>

            <div className="card-content-wrapper pb-12">
              <PhotosSection onPhotoClick={handlePhotoClick} />
            </div>

            <div className="card-content-wrapper pb-12">
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
