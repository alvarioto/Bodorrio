"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
    TipsIcon,
    HotelIcon,
    DresscodeIcon,
} from "./animated-icons";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"; // Assuming you have shadcn dialog or similar, otherwise I'll build a custom simple modal to be safe and dependency-free for this specific section

// Custom simple modal to avoid dependency issues if shadcn is not fully set up or to match the style exactly
const InfoModal = ({
    isOpen,
    onClose,
    title,
    children,
    modalClassName,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    modalClassName?: string;
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className={`bg-card w-full max-w-lg rounded-3xl shadow-xl overflow-hidden pointer-events-auto relative flex flex-col max-h-[90vh] -translate-y-10 md:-translate-y-16 ${modalClassName || ""}`}>
                            {/* Header */}
                            <div className="absolute top-4 right-4 z-10 flex items-center justify-end">
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-black/5 transition-colors bg-card/80 backdrop-blur-sm"
                                >
                                    <X className="w-6 h-6 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-12 overflow-y-auto text-center">
                                <h3 className="font-headline text-3xl mb-6 text-foreground">{title}</h3>
                                <div className="prose prose-stone text-muted-foreground font-sans leading-relaxed text-lg mx-auto">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const Card = ({ title, icon: Icon, onClick }: { title: string; icon: any; onClick: () => void }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-primary/10 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors hover:border-primary/40"
            onClick={onClick}
        >
            <div className="mb-6 text-primary w-full flex justify-center items-center group-hover:scale-110 transition-transform duration-500">
                <Icon size={80} />
            </div>
            <h3
                className="transition-colors group-hover:text-primary w-full text-center"
                style={{
                    fontFamily: '"Forum", serif',
                    fontSize: '27px',
                    color: '#4A6360',
                    margin: '0px auto 12.8px',
                    fontWeight: 400
                }}
            >
                {title}
            </h3>
            <div className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 w-full text-center">
                Ver más
            </div>
        </motion.div>
    );
};

export default function InfoCardsSection() {
    const [activeModal, setActiveModal] = useState<"tips" | "hotels" | "dresscode" | null>(null);

    return (
        <section className="py-24 px-4 relative">
            {/* Decoration background if needed */}

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card
                        title="Tips y Notas"
                        icon={TipsIcon}
                        onClick={() => setActiveModal("tips")}
                    />
                    <Card
                        title="Hoteles"
                        icon={HotelIcon}
                        onClick={() => setActiveModal("hotels")}
                    />
                    <Card
                        title="Dresscode"
                        icon={DresscodeIcon}
                        onClick={() => setActiveModal("dresscode")}
                    />
                </div>
            </div>

            {/* Modals */}
            <InfoModal
                isOpen={activeModal === "tips"}
                onClose={() => setActiveModal(null)}
                title="Tips y Notas"
                modalClassName="-translate-y-16 md:-translate-y-24"
            >
                <div>
                    <p className="mb-4">
                        ¡Nos encantará contar con vosotros! Por favor, confirmad vuestra asistencia antes del <strong>1 de julio</strong>.
                    </p>
                    <p>
                        Si tenéis cualquier duda, podéis llamarnos o escribirnos cuando queráis:
                    </p>
                    <ul className="mt-4 space-y-2 font-medium text-foreground list-none pl-0">
                        <li>Carmen: 695 971 510</li>
                        <li>Álvaro: 639 285 661</li>
                    </ul>
                </div>
            </InfoModal>

            <InfoModal
                isOpen={activeModal === "hotels"}
                onClose={() => setActiveModal(null)}
                title="Alojamiento en Huelva"
            >
                <p className="mb-6">
                    Para aquellos que vengáis de fuera o queráis disfrutar de la fiesta sin preocupaciones, aquí tenéis algunas recomendaciones de hoteles en Huelva ciudad:
                </p>

                <div className="space-y-6 text-left">
                    <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-bold text-foreground text-lg">Hotel Senator Huelva</h4>
                        <p className="text-sm">Céntrico y confortable. Ideal para estar cerca de todo.</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-bold text-foreground text-lg">Exe Tartessos</h4>
                        <p className="text-sm">Moderno y muy bien ubicado, junto a la Casa Colón.</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-bold text-foreground text-lg">NH Luz Huelva</h4>
                        <p className="text-sm">Calidad garantizada y fácil acceso.</p>
                    </div>
                </div>
            </InfoModal>

            <InfoModal
                isOpen={activeModal === "dresscode"}
                onClose={() => setActiveModal(null)}
                title="Dresscode"
            >
                <p className="text-xl italic text-center">
                    "Ponte guapo, ponte guapa... ¡pero trae zapatos cómodos porque pensamos darlo todo en la pista de baile!"
                </p>
                <p className="mt-6 text-center text-sm uppercase tracking-widest text-primary">
                    Etiqueta Formal
                </p>
            </InfoModal>
        </section>
    );
}
