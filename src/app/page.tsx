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
      <div className="invitation-card">
        <HeroSection />

        <div className="bg-card rounded-b-2xl">
          <DetailsSection onRsvpClick={() => setRsvpOpen(true)} />

          <section 
            style={{
              backgroundImage: "url('/paper-texture.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Divider />
            <div className="card-content-wrapper py-16 sm:py-24">
              <TimelineSection />
            </div>
          </section>

          <div 
            style={{
              backgroundImage: "url('/paper-texture.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="card-content-wrapper"
          >
            <PhotosSection onPhotoClick={handlePhotoClick} />
          </div>
          <div 
            className="h-12 md:h-24"
            style={{
              backgroundImage: "url('/paper-texture.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>

      <RsvpModal isOpen={isRsvpOpen} onOpenChange={setRsvpOpen} />
      <LightboxModal
        isOpen={isLightboxOpen}
        onOpenChange={onLightboxOpenChange}
        image={lightboxImage}
      />
    </main>
  );
}
