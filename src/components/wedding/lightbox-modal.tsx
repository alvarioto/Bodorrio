"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface LightboxModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImagePlaceholder | null;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ isOpen, onOpenChange, image }) => {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-4xl w-full rounded-3xl">
        <div className="relative aspect-[3/4] w-full">
            <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover rounded-3xl"
                data-ai-hint={image.imageHint}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LightboxModal;
