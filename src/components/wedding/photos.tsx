"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { CameraIcon } from './animated-icons';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface PhotosSectionProps {
  onPhotoClick: (image: ImagePlaceholder) => void;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ onPhotoClick }) => {
  return (
    <section id="fotos" className="py-16 sm:py-24 w-full">
      <div className="text-center mb-12">
        <h2 className="font-headline text-5xl md:text-6xl">Fotos</h2>
        <p className="text-muted-foreground mt-2">Un vistazo a nuestros momentos.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-card text-card-foreground rounded-3xl shadow-sm border-border overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 flex items-center justify-center bg-secondary rounded-full">
                <CameraIcon />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PlaceHolderImages.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
                  onClick={() => onPhotoClick(photo)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={photo.imageHint}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PhotosSection;
