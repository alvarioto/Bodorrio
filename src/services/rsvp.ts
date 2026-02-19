import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, Timestamp, deleteDoc, doc } from 'firebase/firestore';

export interface Guest {
    id?: string;
    rsvpType: 'ceremony' | 'celebration'; // Diferenciar el origen del RSVP
    name: string;
    attendance: 'yes' | 'no';

    // Solo para celebración
    hasIntolerance?: boolean;
    intoleranceType?: string;
    hasCompanion?: boolean;
    companionName?: string;
    companionHasIntolerance?: boolean;
    companionIntoleranceType?: string;
    children?: string; // Nuevo campo para niños (texto abierto para flexibilidad: "2 niños", "No", "1 bebé")
    bus?: 'none' | 'ida' | 'vuelta' | 'ambos';

    comment?: string;
    createdAt: Timestamp;
}

const COLLECTION_NAME = 'guests';

export const addGuest = async (guest: Omit<Guest, 'id' | 'createdAt'>) => {
    try {
        console.log("Intentando guardar en Firebase...", guest);

        // Timeout de seguridad de 15 segundos
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Tiempo de espera agotado. Revisa tu conexión.")), 15000)
        );

        const addPromise = addDoc(collection(db, COLLECTION_NAME), {
            ...guest,
            createdAt: Timestamp.now(),
        });

        const docRef = await Promise.race([addPromise, timeout]) as any;
        console.log("Guardado con ID: ", docRef.id);
        return docRef.id;
    } catch (e: any) {
        console.error("Error adding document: ", e);
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
        'Nombre', 'Asistencia',
        'Intolerancia', 'Tipo Intolerancia',
        'Acompañante', 'Nombre Acompañante', 'Intolerancia Acompañante', 'Tipo Intolerancia Acompañante',
        'Niños',
        'Autobús',
        'Comentario', 'Fecha Confirmación'
    ];

    const rows = guests.map(g => [
        g.rsvpType === 'ceremony' ? 'CEREMONIA' : 'CELEBRACIÓN',
        `"${g.name}"`,
        g.attendance === 'yes' ? 'SÍ' : 'NO',

        g.hasIntolerance ? 'SÍ' : 'NO',
        `"${g.intoleranceType || ''}"`,

        g.hasCompanion ? 'SÍ' : 'NO',
        `"${g.companionName || ''}"`,
        g.companionHasIntolerance ? 'SÍ' : 'NO',
        `"${g.companionIntoleranceType || ''}"`,

        `"${g.children || ''}"`,
        (g.bus || '').toUpperCase(),

        `"${g.comment || ''}"`,
        g.createdAt.toDate().toLocaleString('es-ES')
    ]);

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
