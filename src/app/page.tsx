"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/wedding/hero';
import DetailsSection from '@/components/wedding/details';
import PhotosSection from '@/components/wedding/photos';
import RsvpModal from '@/components/wedding/rsvp-modal';
import LightboxModal from '@/components/wedding/lightbox-modal';
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import TimelineSection from '@/components/wedding/timeline';
import Divider from '@/components/wedding/divider';

export default function WeddingPage() {
  const [isRsvpOpen, setRsvpOpen] = useState(false);
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
    <main className="page-container">
      <header>
        <div 
          className="invitation-card"
          style={{
            backgroundImage: "url('/paper-texture.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <HeroSection />

          <div className="rounded-b-2xl">
            <DetailsSection onRsvpClick={() => setRsvpOpen(true)} />

            <section>
              <Divider />
              <div className="card-content-wrapper py-16 sm:py-24">
                <TimelineSection />
              </div>
            </section>

            <div className="card-content-wrapper">
              <PhotosSection onPhotoClick={handlePhotoClick} />
            </div>
            <div 
              className="h-12 md:h-24"
            />
          </div>
        </div>
      </header>

      <RsvpModal isOpen={isRsvpOpen} onOpenChange={setRsvpOpen} />
      <LightboxModal
        isOpen={isLightboxOpen}
        onOpenChange={onLightboxOpenChange}
        image={lightboxImage}
      />
    </main>
  );
}
