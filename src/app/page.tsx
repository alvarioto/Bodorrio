"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/wedding/hero';
import DetailsSection from '@/components/wedding/details';
import PhotosSection from '@/components/wedding/photos';
import TimelineSection from '@/components/wedding/timeline';
import Divider from '@/components/wedding/divider';
import RsvpModal from '@/components/wedding/rsvp-modal';
import LightboxModal from '@/components/wedding/lightbox-modal';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export default function WeddingPage() {
  const [isRsvpOpen, setRsvpOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ImagePlaceholder | null>(null);

  return (
    <main className="page-container">
      <div className="invitation-card">
        <HeroSection />
        <div className="card-content-wrapper">
          <Divider />
          <DetailsSection onRsvpClick={() => setRsvpOpen(true)} />
          <Divider />
          <PhotosSection onPhotoClick={setLightboxImage} />
          <Divider />
          <TimelineSection />
        </div>
        <div className="h-12 md:h-24" />
      </div>

      <RsvpModal isOpen={isRsvpOpen} onOpenChange={setRsvpOpen} />
      
      <LightboxModal
        isOpen={!!lightboxImage}
        onOpenChange={(isOpen) => !isOpen && setLightboxImage(null)}
        image={lightboxImage}
      />
    </main>
  );
}
