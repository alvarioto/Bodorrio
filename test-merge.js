const normalizeName = (name) => {
    if (!name) return "";
    return name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ');
};

const allGuests = [
    {
        id: "doc123",
        name: "aaa aaa aaa",
        ceremonyAttendance: "yes",
        companions: [],
        childrenDetail: []
    }
];

const guestPayload = {
    name: "bbb bbb bbb",
    celebrationAttendance: "yes",
    hasCompanion: true,
    companions: [
        { name: "aaa aaa aaa", hasIntolerance: false }
    ],
    childrenDetail: [
        { name: "ccc ccc ccc", hasIntolerance: false }
    ]
};

const newGuestNameNorm = normalizeName(guestPayload.name);

console.log("=== START ROUTE SIMULATION ===");
console.log("NUEVO INVITADO (Nomalizado):", newGuestNameNorm);
if (guestPayload.companions) console.log("ACOMPAÑANTES DEL NUEVO:", guestPayload.companions.map(c => normalizeName(c.name)));

const existingDocIndex = allGuests.findIndex(g => {
    const gNameNorm = normalizeName(g.name);
    console.log("Scanning existing DB guest:", gNameNorm);
    if (!gNameNorm) return false;

    if (gNameNorm === newGuestNameNorm) { console.log("Match rule 1"); return true; }
    if (g.companions && g.companions.some(c => normalizeName(c.name) === newGuestNameNorm)) { console.log("Match rule 2"); return true; }
    if (g.hasCompanion && g.companionName && normalizeName(g.companionName) === newGuestNameNorm) { console.log("Match rule 3"); return true; }

    // REVERSE MATCH
    if (guestPayload.companions && guestPayload.companions.length > 0) {
        const isCompanionAlreadyPrimary = guestPayload.companions.some(newC => {
            const normNewC = normalizeName(newC.name);
            console.log("Comparing new companion:", normNewC, "against DB primary:", gNameNorm);
            return normNewC === gNameNorm && normNewC !== newGuestNameNorm;
        });
        if (isCompanionAlreadyPrimary) {
            console.log("¡MATCH INVERSO ENCONTRADO! El acompañante", gNameNorm, "ya es titular.");
            return true;
        }
    }

    return false;
});

console.log("Resulting Index:", existingDocIndex);
