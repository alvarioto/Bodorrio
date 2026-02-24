import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, Timestamp, deleteDoc, doc, where, updateDoc } from 'firebase/firestore';

export interface Companion {
    name: string;
    hasIntolerance?: boolean;
    intoleranceType?: string;
}

export interface Guest {
    id?: string;
    name: string;
    firstName?: string;
    lastName?: string;

    // Sustituyendo rsvpType y attendance por campos específicos para cada evento
    ceremonyAttendance?: 'yes' | 'no';
    celebrationAttendance?: 'yes' | 'no';

    // Solo para celebración
    hasIntolerance?: boolean;
    intoleranceType?: string;

    // Nuevo soporte para MÚLTIPLES acompañantes
    companions?: Companion[];

    // Legacy (mantenido para no romper datos antiguos)
    hasCompanion?: boolean;
    companionName?: string;
    companionHasIntolerance?: boolean;
    companionIntoleranceType?: string;

    children?: string; // Nuevo campo para niños (texto abierto para flexibilidad: "2 niños", "No", "1 bebé")
    childrenDetail?: Companion[]; // Nuevo soporte para MÚLTIPLES niños
    bus?: 'none' | 'ida' | 'vuelta' | 'ambos';

    comment?: string;
    createdAt: Timestamp;
}

const COLLECTION_NAME = 'guests';

export const addGuest = async (guest: Omit<Guest, 'id' | 'createdAt'>): Promise<{ id: string, warnings: string[], isUpdate: boolean }> => {
    try {
        const warnings: string[] = [];

        // Obtener la lista completa de invitados actuales para comprobación cruzada (principal y acompañantes)
        const allGuestsSnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const allGuests = allGuestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));

        const normalizeName = (name: string | undefined | null) => {
            if (!name) return "";
            return name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ');
        };
        const newGuestNameNorm = normalizeName(guest.name);

        const allExistingNames = new Set<string>();
        allGuests.forEach(g => {
            allExistingNames.add(normalizeName(g.name));
            if (g.companions) g.companions.forEach(c => allExistingNames.add(normalizeName(c.name)));
            if (g.hasCompanion && g.companionName) allExistingNames.add(normalizeName(g.companionName));
            if (g.childrenDetail) g.childrenDetail.forEach(c => allExistingNames.add(normalizeName(c.name)));
        });

        // Advertencias informativas (sin bloquear db)
        if (guest.companions && guest.companions.length > 0) {
            guest.companions.forEach(c => {
                const normC = normalizeName(c.name);
                if (normC !== newGuestNameNorm && allExistingNames.has(normC)) {
                    // Solo empujamos warning genérico si no es un match inverso obvio que capturaremos abajo
                    warnings.push(`El acompañante "${c.name}" ya estaba registrado previamente. ¡Los hemos enlazado!`);
                }
            });
        }

        if (guest.childrenDetail && guest.childrenDetail.length > 0) {
            guest.childrenDetail.forEach(c => {
                const normC = normalizeName(c.name);
                if (allExistingNames.has(normC)) {
                    warnings.push(`El niño/a "${c.name}" ya estaba en el sistema. ¡Fusión completada!`);
                }
            });
        }

        console.log("=== INICIANDO TENTATIVA DE GUARDADO ===");
        console.log("NUEVO INVITADO (Nomalizado):", newGuestNameNorm);
        if (guest.companions) console.log("ACOMPAÑANTES DEL NUEVO:", guest.companions.map(c => normalizeName(c.name)));

        // 1. Encontrar el documento HEAD DE FAMILIA (Reverse Match) si existe
        let familyHeadDocIndex = -1;
        if (guest.companions && guest.companions.length > 0) {
            familyHeadDocIndex = allGuests.findIndex(g => {
                const gNameNorm = normalizeName(g.name);
                if (!gNameNorm) return false;
                return guest.companions!.some(newC => {
                    const normNewC = normalizeName(newC.name);
                    return normNewC === gNameNorm && normNewC !== newGuestNameNorm;
                });
            });
        }

        // 2. Encontrar el documento DEDICADO AL TITULAR ACTUAL (Direct Match) si existe
        const selfMatchDocIndex = allGuests.findIndex(g => {
            const gNameNorm = normalizeName(g.name);
            if (!gNameNorm) return false;
            if (gNameNorm === newGuestNameNorm) return true;
            if (g.companions && g.companions.some(c => normalizeName(c.name) === newGuestNameNorm)) return true;
            if (g.hasCompanion && g.companionName && normalizeName(g.companionName) === newGuestNameNorm) return true;
            return false;
        });

        const targetDocIndex = familyHeadDocIndex !== -1 ? familyHeadDocIndex : selfMatchDocIndex;

        if (targetDocIndex !== -1) {
            const existingData = allGuests[targetDocIndex];
            const existingDocId = allGuestsSnapshot.docs[targetDocIndex].id;

            // Si detectamos que BBB fusiona hacia AAA (Head), pero BBB ya tenía un documento suelto (por ej. solo Ceremonia), 
            // debemos asegurar que limpiamos el documento viejo de BBB para unificar todo bajo AAA.
            if (familyHeadDocIndex !== -1 && selfMatchDocIndex !== -1 && familyHeadDocIndex !== selfMatchDocIndex) {
                const looseDocId = allGuestsSnapshot.docs[selfMatchDocIndex].id;
                const looseData = allGuests[selfMatchDocIndex];
                console.log(`Borrando doc suelto ${looseDocId} para unificarlo en el Head familiar ${existingDocId}`);
                try { await deleteDoc(doc(db, COLLECTION_NAME, looseDocId)); } catch (e) { console.error("Error unificando", e); }

                // Rescatar campos del hermano suelto antes de borrar
                if (looseData.ceremonyAttendance === 'yes') existingData.ceremonyAttendance = 'yes';
                if (looseData.celebrationAttendance === 'yes') existingData.celebrationAttendance = 'yes';
                if (!existingData.bus && looseData.bus) existingData.bus = looseData.bus;
            }

            // Función auxiliar para quitar campos undefined
            const cleanUndefined = (obj: any): any => {
                if (Array.isArray(obj)) return obj.map(cleanUndefined);
                if (obj !== null && typeof obj === 'object') {
                    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, cleanUndefined(v)]));
                }
                return obj;
            };

            // Intelligent Merge Logic
            const mergedCompanions = [...(existingData.companions || [])];
            if (guest.companions) {
                guest.companions.forEach(newComp => {
                    if (normalizeName(newComp.name) === normalizeName(existingData.name)) return;
                    const exists = mergedCompanions.some(c => normalizeName(c.name) === normalizeName(newComp.name));
                    if (!exists) mergedCompanions.push(newComp);
                });
            }
            // Si el titular que registra (BBB) se está fusionando a la reserva de AAA, BBB se añade como acompañante
            if (normalizeName(existingData.name) !== newGuestNameNorm) {
                const submitterExists = mergedCompanions.some(c => normalizeName(c.name) === newGuestNameNorm);
                if (!submitterExists) {
                    mergedCompanions.push({
                        name: guest.name,
                        hasIntolerance: guest.hasIntolerance,
                        intoleranceType: guest.intoleranceType
                    });
                }
                warnings.push(`Agrupado exitosamente en la confirmación familiar de ${existingData.name}.`);
            }

            const mergedChildren = [...(existingData.childrenDetail || [])];
            if (guest.childrenDetail) {
                guest.childrenDetail.forEach(newChild => {
                    const exists = mergedChildren.some(c => normalizeName(c.name) === normalizeName(newChild.name));
                    if (!exists) mergedChildren.push(newChild);
                });
            }

            const mergedData = {
                ...existingData,
                ...guest,
                name: existingData.name, // always keep the original primary booker's name as the document ID baseline
                firstName: existingData.firstName,
                lastName: existingData.lastName, // Fallback to 'lastName' property safely 
                companions: mergedCompanions,
                hasCompanion: mergedCompanions.length > 0,
                childrenDetail: mergedChildren,
                hasChildren: mergedChildren.length > 0,
                children: mergedChildren.length > 0 ? `${mergedChildren.length} niños` : "", // Protect legacy format
            };

            // Preserve specific event attendance if it was already "yes"
            if (existingData.ceremonyAttendance === 'yes') mergedData.ceremonyAttendance = 'yes';
            if (existingData.celebrationAttendance === 'yes') mergedData.celebrationAttendance = 'yes';

            const updatedData = cleanUndefined(mergedData);

            // Timeout de seguridad de 15 segundos
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Tiempo de espera agotado. Revisa tu conexión.")), 15000)
            );

            const updatePromise = updateDoc(doc(db, COLLECTION_NAME, existingDocId), updatedData);

            await Promise.race([updatePromise, timeout]);
            console.log("Documento actualizado: ", existingDocId);
            return { id: existingDocId, warnings, isUpdate: true };
        }

        console.log("Intentando guardar en Firebase...", guest);

        // Timeout de seguridad de 15 segundos
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Tiempo de espera agotado. Revisa tu conexión.")), 15000)
        );

        // Función auxiliar para quitar campos undefined
        const cleanUndefined = (obj: any): any => {
            if (Array.isArray(obj)) return obj.map(cleanUndefined);
            if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj)
                        .filter(([_, v]) => v !== undefined)
                        .map(([k, v]) => [k, cleanUndefined(v)])
                );
            }
            return obj;
        };

        const cleanGuest = cleanUndefined(guest);

        const addPromise = addDoc(collection(db, COLLECTION_NAME), {
            ...cleanGuest,
            createdAt: Timestamp.now(),
        });

        const docRef = await Promise.race([addPromise, timeout]) as any;
        console.log("Guardado con ID: ", docRef.id);
        return { id: docRef.id, warnings, isUpdate: false };
    } catch (e: any) {
        console.error("Error adding document: ", e);

        if (e.message === "duplicate_entry_ceremony") {
            throw new Error("¡Ya has confirmado tu asistencia a la ceremonia! ¿Te puede la impaciencia por coger sitio en el banco? ⛪");
        }
        if (e.message === "duplicate_entry_celebration") {
            throw new Error("¡Oye, que ya estabas apuntado a la celebración! No intentes colarte dos veces al buffet abierto... 🍽️🥂");
        }
        // Si es error de permisos o red, intentar dar más info
        if (e.code === 'permission-denied') {
            throw new Error("Permiso denegado. Intenta recargar la página.");
        }
        if (e.code === 'unavailable') {
            throw new Error("Sin conexión con el servidor. Revisa tu internet.");
        }
        throw e;
    }
};

export const deleteGuest = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};

export const getGuests = async (): Promise<Guest[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Guest));
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

export const exportGuestsToCSV = async () => {
    const guests = await getGuests();
    if (guests.length === 0) return;

    const headers = [
        'Tipo RSVP',
        'Nombre Completo', 'Nombre Pila', 'Apellidos',
        'Asistencia',
        'Intolerancia', 'Tipo Intolerancia',
        'Acompañantes (Detalle)',
        'Niños (Detalle)',
        'Autobús',
        'Comentario', 'Vínculos', 'Fecha Confirmación'
    ];

    const rows = guests.map(currentGuest => {
        const g = currentGuest;

        // Find relations for CSV
        const normalizeName = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normCurrent = normalizeName(currentGuest.name);
        const relations: string[] = [];

        guests.forEach(otherG => {
            if (otherG.id === currentGuest.id) return;
            const normOther = normalizeName(otherG.name);

            let isMentionedByOther = false;
            let mentionsOther = false;
            let shareEntity = false;

            if (otherG.companions?.some(c => normalizeName(c.name) === normCurrent) ||
                (otherG.hasCompanion && otherG.companionName && normalizeName(otherG.companionName) === normCurrent) ||
                (otherG.childrenDetail?.some(c => normalizeName(c.name) === normCurrent))) {
                isMentionedByOther = true;
            }

            if (currentGuest.companions?.some(c => normalizeName(c.name) === normOther) ||
                (currentGuest.hasCompanion && currentGuest.companionName && normalizeName(currentGuest.companionName) === normOther) ||
                (currentGuest.childrenDetail?.some(c => normalizeName(c.name) === normOther))) {
                mentionsOther = true;
            }

            const currentEntities = [
                ...(currentGuest.companions || []).map(c => normalizeName(c.name)),
                ...(currentGuest.childrenDetail || []).map(c => normalizeName(c.name))
            ];
            if (currentGuest.hasCompanion && currentGuest.companionName) currentEntities.push(normalizeName(currentGuest.companionName));

            const otherEntities = [
                ...(otherG.companions || []).map(c => normalizeName(c.name)),
                ...(otherG.childrenDetail || []).map(c => normalizeName(c.name))
            ];
            if (otherG.hasCompanion && otherG.companionName) otherEntities.push(normalizeName(otherG.companionName));

            if (currentEntities.length > 0 && currentEntities.some(e => otherEntities.includes(e))) {
                shareEntity = true;
            }

            if (isMentionedByOther || mentionsOther || shareEntity) {
                relations.push(otherG.name);
            }
        });
        const relationsStr = Array.from(new Set(relations)).join(', ');

        // Formatear acompañantes
        let companionsStr = '';
        if (g.companions && g.companions.length > 0) {
            companionsStr = g.companions.map(c =>
                `${c.name}${c.hasIntolerance ? ` (Intolerancia: ${c.intoleranceType})` : ''}`
            ).join(' | ');
        } else if (g.hasCompanion) {
            // Fallback legacy
            companionsStr = `${g.companionName || ''}${g.companionHasIntolerance ? ` (Intolerancia: ${g.companionIntoleranceType})` : ''}`;
        }

        // Formatear Niños
        let childrenStr = '';
        if (g.childrenDetail && g.childrenDetail.length > 0) {
            childrenStr = g.childrenDetail.map(c =>
                `${c.name}${c.hasIntolerance ? ` (${c.intoleranceType})` : ''}`
            ).join(' | ');
        } else if (g.children && typeof g.children === 'string') {
            childrenStr = g.children; // Legacy
        }

        return [
            // Como ahora pueden ser ambos, indicamos qué asiste
            `${g.ceremonyAttendance === 'yes' ? 'CEREMONIA ' : ''}${g.celebrationAttendance === 'yes' ? 'CELEBRACIÓN' : ''}`.trim() || 'NO ASISTE',
            `"${g.name}"`,
            `"${g.firstName || ''}"`,
            `"${g.lastName || ''}"`,
            `CER: ${g.ceremonyAttendance === 'yes' ? 'SÍ' : (g.ceremonyAttendance === 'no' ? 'NO' : '-')} | CEL: ${g.celebrationAttendance === 'yes' ? 'SÍ' : (g.celebrationAttendance === 'no' ? 'NO' : '-')}`,
            g.hasIntolerance ? 'SÍ' : 'NO',
            `"${g.intoleranceType || ''}"`,
            `"${companionsStr}"`,
            `"${childrenStr}"`, // Nueva columna unificada
            (g.bus || '').toUpperCase(),
            `"${g.comment || ''}"`,
            `"${relationsStr}"`,
            // Safe date formatting
            (() => {
                let d: Date;
                if (g.createdAt && typeof (g.createdAt as any).toDate === 'function') {
                    d = (g.createdAt as any).toDate();
                } else if (g.createdAt && typeof (g.createdAt as any).seconds === 'number') {
                    d = new Date((g.createdAt as any).seconds * 1000);
                } else if (g.createdAt) {
                    d = new Date(g.createdAt as any);
                } else {
                    return '';
                }
                const formattedDate = isNaN(d.getTime()) ? '' : d.toLocaleString('es-ES');
                return `"${formattedDate}"`;
            })()
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invitados_boda_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getGuestByName = async (firstName: string, lastNamesStr: string, currentEvent: 'ceremony' | 'celebration'): Promise<Guest | null> => {
    try {
        const fullName = `${firstName.trim()} ${lastNamesStr.trim()}`;
        const normalizeName = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const targetNorm = normalizeName(fullName);

        const allGuestsSnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const allGuests = allGuestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));

        const match = allGuests.find(g => {
            // Only consider it an "existing guest" IF they already have data for this specific event type
            // This prevents a "Ceremony" registration from blocking a fresh "Celebration" registration
            if (currentEvent === 'ceremony' && !g.ceremonyAttendance) return false;
            if (currentEvent === 'celebration' && !g.celebrationAttendance) return false;

            if (normalizeName(g.name) === targetNorm) return true;
            if (g.companions && g.companions.some(c => normalizeName(c.name) === targetNorm)) return true;
            if (g.hasCompanion && g.companionName && normalizeName(g.companionName) === targetNorm) return true;
            return false;
        });

        return match || null;
    } catch (e) {
        console.error("Error finding guest by name:", e);
        return null;
    }
};

export const manualMergeGuests = async (sourceId: string, targetId: string): Promise<void> => {
    try {
        if (sourceId === targetId) throw new Error("No puedes fusionar un invitado consigo mismo.");

        const sourceDocRef = doc(db, COLLECTION_NAME, sourceId);
        const targetDocRef = doc(db, COLLECTION_NAME, targetId);

        const allDocsSnapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
        const allGuests = allDocsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Guest));

        const sourceGuest = allGuests.find(g => g.id === sourceId);
        const targetGuest = allGuests.find(g => g.id === targetId);

        if (!sourceGuest || !targetGuest) {
            throw new Error("No se encontraron los invitados en la base de datos.");
        }

        const normalizeName = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ');

        const mergedCompanions = [...(targetGuest.companions || [])];

        // Añadir el propio sourceGuest como acompañante del targetGuest
        const sourceNameNorm = normalizeName(sourceGuest.name);
        const existsAsSubmitter = mergedCompanions.some(c => normalizeName(c.name) === sourceNameNorm) || normalizeName(targetGuest.name) === sourceNameNorm;

        if (!existsAsSubmitter) {
            mergedCompanions.push({
                name: sourceGuest.name,
                hasIntolerance: sourceGuest.hasIntolerance,
                intoleranceType: sourceGuest.intoleranceType
            });
        }

        // Añadir los acompañantes que ya tuviera el sourceGuest
        if (sourceGuest.companions) {
            sourceGuest.companions.forEach(c => {
                const normC = normalizeName(c.name);
                if (normC !== normalizeName(targetGuest.name) && !mergedCompanions.some(existingC => normalizeName(existingC.name) === normC)) {
                    mergedCompanions.push(c);
                }
            });
        }

        // Fallback por si sourceGuest tenía accompanyName legacy
        if (sourceGuest.hasCompanion && sourceGuest.companionName) {
            const normC = normalizeName(sourceGuest.companionName);
            if (normC !== normalizeName(targetGuest.name) && !mergedCompanions.some(existingC => normalizeName(existingC.name) === normC)) {
                mergedCompanions.push({
                    name: sourceGuest.companionName,
                    hasIntolerance: sourceGuest.companionHasIntolerance,
                    intoleranceType: sourceGuest.companionIntoleranceType
                });
            }
        }

        const mergedChildren = [...(targetGuest.childrenDetail || [])];
        if (sourceGuest.childrenDetail) {
            sourceGuest.childrenDetail.forEach(newChild => {
                const exists = mergedChildren.some(c => normalizeName(c.name) === normalizeName(newChild.name));
                if (!exists) mergedChildren.push(newChild);
            });
        }

        // Preparar nuevos datos actualizados
        const updatedData: Partial<Guest> = {
            companions: mergedCompanions,
            hasCompanion: mergedCompanions.length > 0,
            childrenDetail: mergedChildren,
            // @ts-ignore
            hasChildren: mergedChildren.length > 0,
            children: mergedChildren.length > 0 ? `${mergedChildren.length} niños` : targetGuest.children || "",
        };

        if (sourceGuest.ceremonyAttendance === 'yes') updatedData.ceremonyAttendance = 'yes';
        if (sourceGuest.celebrationAttendance === 'yes') updatedData.celebrationAttendance = 'yes';
        if (!targetGuest.bus && sourceGuest.bus) updatedData.bus = sourceGuest.bus;

        // Función auxiliar para quitar campos undefined de forma recursiva (vital para arrays de acompañantes)
        const cleanUndefined = (obj: any): any => {
            if (Array.isArray(obj)) return obj.map(cleanUndefined);
            if (obj !== null && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj)
                        .filter(([_, v]) => v !== undefined)
                        .map(([k, v]) => [k, cleanUndefined(v)])
                );
            }
            return obj;
        };

        const finalUpdatedData = cleanUndefined(updatedData);

        // 1. Update Target
        await updateDoc(targetDocRef, finalUpdatedData);

        // 2. Delete Source
        await deleteDoc(sourceDocRef);

        console.log(`Fusión exitosa: ${sourceGuest.name} movido dentro de ${targetGuest.name}`);

    } catch (e) {
        console.error("Error en manualMergeGuests:", e);
        throw e;
    }
};
