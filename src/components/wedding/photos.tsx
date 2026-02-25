"use client";

import React from 'react';
import Image from 'next/image';
import { CameraIcon } from './animated-icons';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface PhotosSectionProps {
  onPhotoClick: (image: ImagePlaceholder) => void;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ onPhotoClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: true,
  }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      speed: 0.5, // Even slower speed
    })
  ]);



  return (
    <section id="fotos" className="py-24 w-full relative overflow-hidden">
      {/* Background decoration (optional/subtle) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-headline text-4xl md:text-5xl mb-4"
          >
            Fotos
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Un pequeño vistazo a nuestra historia juntos.
          </motion.p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 shadow-sm w-full max-w-[95%] xl:max-w-[90rem] mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center"
            >
              <CameraIcon size={120} className="text-primary" />
            </motion.div>
          </div>

          <div className="relative w-full mx-auto">
            <div
              className="overflow-hidden px-4"
              ref={emblaRef}
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
              }}
            >
              <div className="flex -ml-4">
                {PlaceHolderImages.map((photo, index) => (
                  <div key={photo.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.3 } }}
                      className="group cursor-pointer h-full"
                      onClick={() => onPhotoClick(photo)}
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 bg-muted h-full">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.description}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="font-medium text-sm">{photo.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotosSection;
