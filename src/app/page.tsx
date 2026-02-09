"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/wedding/hero';
import DetailsSection from '@/components/wedding/details';
import PhotosSection from '@/components/wedding/photos';
import TimelineSection from '@/components/wedding/timeline';
import RsvpModal from '@/components/wedding/rsvp-modal';
import LightboxModal from '@/components/wedding/lightbox-modal';
import { type ImagePlaceholder } from '@/lib/placeholder-images';

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

          <div className="card-content-wrapper">
            <PhotosSection onPhotoClick={handlePhotoClick} />
            <TimelineSection />
          </div>
          <div className="h-12 md:h-24" />
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
