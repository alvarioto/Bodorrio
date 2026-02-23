"use client";

import React, { useState, useEffect } from 'react';
import { getGuests, Guest, deleteGuest } from '@/services/rsvp';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lock, Download, RefreshCw, Bus, Utensils, Baby, Trash2, Home, UserPlus, FileDown, Link as LinkIcon } from 'lucide-react';
import { exportGuestsToCSV } from '@/services/rsvp';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Helper to safely format dates
    const safeFormatDate = (dateObj: any, format: 'date' | 'time') => {
        if (!dateObj) return '';
        try {
            let d: Date;
            if (typeof dateObj.toDate === 'function') d = dateObj.toDate();
            else if (dateObj.seconds) d = new Date(dateObj.seconds * 1000);
            else d = new Date(dateObj);

            if (isNaN(d.getTime())) return '';

            if (format === 'date') return d.toLocaleDateString();
            return d.toLocaleTimeString().slice(0, 5);
        } catch (e) {
            return '';
        }
    };
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        ceremony: 0,
        celebration: 0,
        busIda: 0,
        busVuelta: 0,
        intolerances: 0,
        children: 0,
    });

    const [loginError, setLoginError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setProcessing(true);

        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const pass = password.trim().toLowerCase();
        if (pass === "bodorrio2026" || pass === "admin") {
            setProcessing(false);
            setIsAuthenticated(true);
        } else {
            setLoginError("Contraseña incorrecta");
            setProcessing(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getGuests();
            setGuests(data);
            calculateStats(data);
        } catch (error) {
            console.error("Error fetching guests:", error);
            alert("Error cargando datos. Verifica tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        try {
            await deleteGuest(id);
            // Optimistic update
            setGuests(guests.filter(g => g.id !== id));
            // Recalculate stats based on remaining guests
            calculateStats(guests.filter(g => g.id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo borrar el registro.");
        }
    };

    const calculateStats = (data: Guest[]) => {
        let cerSet = new Set<string>();
        let celSet = new Set<string>();
        let busIdaSet = new Set<string>();
        let busVueltaSet = new Set<string>();
        let intolSet = new Set<string>();
        let childSet = new Set<string>();
        let legacyChildCount = 0;

        const normalizeName = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        data.forEach(g => {
            const normName = normalizeName(g.name);

            if (g.ceremonyAttendance === 'yes') {
                cerSet.add(normName);
                if (g.companions) g.companions.forEach(c => cerSet.add(normalizeName(c.name)));
                if (g.hasCompanion && g.companionName) cerSet.add(normalizeName(g.companionName));
            }

            if (g.celebrationAttendance === 'yes') {
                celSet.add(normName);
                if (g.companions) g.companions.forEach(c => celSet.add(normalizeName(c.name)));
                if (g.hasCompanion && g.companionName) celSet.add(normalizeName(g.companionName));

                if (g.bus === 'ida' || g.bus === 'ambos') {
                    busIdaSet.add(normName);
                    if (g.companions) g.companions.forEach(c => busIdaSet.add(normalizeName(c.name)));
                    if (g.hasCompanion && g.companionName) busIdaSet.add(normalizeName(g.companionName));
                }
                if (g.bus === 'vuelta' || g.bus === 'ambos') {
                    busVueltaSet.add(normName);
                    if (g.companions) g.companions.forEach(c => busVueltaSet.add(normalizeName(c.name)));
                    if (g.hasCompanion && g.companionName) busVueltaSet.add(normalizeName(g.companionName));
                }
            }

            if (g.hasIntolerance && (g.ceremonyAttendance === 'yes' || g.celebrationAttendance === 'yes')) intolSet.add(normName);
            if (g.companions) g.companions.forEach(c => { if (c.hasIntolerance) intolSet.add(normalizeName(c.name)); });
            if (g.hasCompanion && g.companionHasIntolerance && g.companionName) intolSet.add(normalizeName(g.companionName));

            if (g.childrenDetail && g.childrenDetail.length > 0) {
                g.childrenDetail.forEach(c => childSet.add(normalizeName(c.name)));
            } else if (g.children && g.children.trim() !== "") {
                const num = parseInt(g.children);
                if (!isNaN(num)) legacyChildCount += num;
                else legacyChildCount += 1;
            }
        });

        const stats = {
            total: data.length,
            ceremony: cerSet.size,
            celebration: celSet.size,
            busIda: busIdaSet.size,
            busVuelta: busVueltaSet.size,
            intolerances: intolSet.size,
            children: childSet.size + legacyChildCount,
        };
        setStats(stats);
    };

    const findRelations = (currentGuest: Guest, allGuests: Guest[]) => {
        const normalizeName = (name: string) => name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normCurrent = normalizeName(currentGuest.name);
        const relations: string[] = [];

        allGuests.forEach(otherG => {
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

            // Check if they share any entity
            if (currentEntities.length > 0 && currentEntities.some(e => otherEntities.includes(e))) {
                shareEntity = true;
            }

            // Also check if currentGuest and otherG are listed as companions to EACH OTHER explicitly,
            // or if they just happen to have the same child in their forms
            if (isMentionedByOther || mentionsOther || shareEntity) {
                relations.push(otherG.name);
            }
        });

        return Array.from(new Set(relations));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4 text-stone-200">
                <Card className="w-full max-w-md shadow-2xl border-white/5 bg-[#121815]">
                    <CardHeader className="text-center pb-6 border-b border-white/5">
                        <div className="mx-auto bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/30">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-3xl text-primary tracking-wide">Área Privada</CardTitle>
                        <p className="text-stone-400 text-sm">Gestión de invitados</p>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setLoginError("");
                                    }}
                                    className="text-center text-lg h-12 bg-[#1a211e] border-white/10 text-white focus:border-primary/50 placeholder:text-white/20"
                                    autoFocus
                                />
                                {loginError && (
                                    <p className="text-red-400 text-sm text-center font-medium animate-pulse">
                                        {loginError}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-headline tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={processing || !password}
                            >
                                {processing ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : 'Acceder'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d] text-stone-300 p-4 pb-24 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#121815] p-6 rounded-3xl shadow-xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="md:hidden">
                            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                                <Home className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-headline text-primary tracking-wide">Panel de Invitados</h1>
                            <p className="text-stone-500 text-sm">Resumen en tiempo real · <span className="text-primary/70">{stats.total} registros</span></p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/" className="hidden md:block">
                            <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-stone-300 hover:text-white">
                                <Home className="w-4 h-4 mr-2" />
                                Volver a la Web
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="bg-transparent border-white/10 hover:bg-white/5 text-stone-300 hover:text-white">
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button size="sm" onClick={exportGuestsToCSV} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <FileDown className="w-4 h-4 mr-2" />
                            Descargar Excel
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#121815] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center hover:border-primary/20 transition-colors">
                        <span className="text-4xl md:text-5xl font-headline text-primary mb-2">{stats.celebration}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Celebración</span>
                    </div>
                    <div className="bg-[#121815] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center hover:border-primary/20 transition-colors">
                        <span className="text-4xl md:text-5xl font-headline text-primary mb-2">{stats.ceremony}</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Ceremonia</span>
                    </div>
                    <div className="bg-[#121815] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center hover:border-primary/20 transition-colors">
                        <Bus className="w-8 h-8 text-primary/60 mb-3" />
                        <div className="text-sm font-medium text-stone-300">Ida: <span className="text-white">{stats.busIda}</span></div>
                        <div className="text-sm font-medium text-stone-300">Vuelta: <span className="text-white">{stats.busVuelta}</span></div>
                    </div>
                    <div className="bg-[#121815] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center hover:border-primary/20 transition-colors">
                        <div className="flex gap-6 mb-3">
                            <div className="flex flex-col items-center">
                                <Utensils className="w-5 h-5 text-amber-500 mb-1" />
                                <span className="font-bold text-lg text-white">{stats.intolerances}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Baby className="w-5 h-5 text-blue-400 mb-1" />
                                <span className="font-bold text-lg text-white">{stats.children}</span>
                            </div>
                        </div>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Especiales</span>
                    </div>
                </div>

                {/* Guest List - Mobile Friendly Card Layout */}
                <div className="space-y-4 md:hidden">
                    <h3 className="font-headline text-xl pl-2 text-primary/80">Listado de Invitados</h3>
                    {guests.map((guest) => (
                        <Card key={guest.id} className="overflow-hidden bg-[#121815] border-white/10 text-stone-300">
                            <CardHeader className="bg-white/5 pb-3 border-b border-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-primary font-bold tracking-wide">{guest.name}</CardTitle>
                                        <div className="text-xs text-stone-500 mt-1 font-mono">
                                            {safeFormatDate(guest.createdAt, 'date')} · {safeFormatDate(guest.createdAt, 'time')}
                                        </div>
                                        {findRelations(guest, guests).length > 0 && (
                                            <div className="mt-2 text-xs flex items-center gap-1 text-primary/80 bg-primary/10 w-fit px-2 py-0.5 rounded-full border border-primary/20">
                                                <LinkIcon className="w-3 h-3" />
                                                Grupo: {findRelations(guest, guests).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={(guest.ceremonyAttendance === 'yes' || guest.celebrationAttendance === 'yes') ? 'default' : 'destructive'} className="uppercase text-[10px] tracking-wider">
                                            {(guest.ceremonyAttendance === 'yes' || guest.celebrationAttendance === 'yes') ? 'Asiste' : 'No asiste'}
                                        </Badge>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400/50 hover:text-red-400 hover:bg-red-400/10">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1a211e] border-white/10 text-stone-200">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-white">¿Borrar registro?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-stone-400">
                                                        Estás a punto de borrar a <span className="text-primary font-bold">{guest.name}</span>. Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-transparent border-white/10 text-stone-300 hover:bg-white/5 hover:text-white">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => guest.id && handleDelete(guest.id)} className="bg-red-900 text-red-100 hover:bg-red-800 border border-red-800">Borrar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 text-sm space-y-3">
                                {/* Grupo Familiar */}
                                {(guest.companions?.length || guest.childrenDetail?.length) ? (
                                    <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="text-[10px] uppercase font-bold tracking-wider text-primary/70 mb-1">Grupo Familiar</div>
                                        {guest.companions && guest.companions.map((c, i) => (
                                            <div key={`mob-comp-${i}`} className="flex items-center gap-2 text-stone-300 relative pl-2">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                                                <UserPlus className="w-3.5 h-3.5 text-primary/70" />
                                                <span className="font-medium">{c.name}</span>
                                            </div>
                                        ))}
                                        {guest.childrenDetail && guest.childrenDetail.map((c, i) => (
                                            <div key={`mob-child-${i}`} className="flex items-center gap-2 text-stone-300 relative pl-2 mt-1.5">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-400/20 rounded-full" />
                                                <Baby className="w-3.5 h-3.5 text-blue-400/70" />
                                                <span className="font-medium">{c.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {/* Intolerancias */}
                                {(guest.hasIntolerance || guest.companions?.some(c => c.hasIntolerance) || guest.childrenDetail?.some(c => c.hasIntolerance)) && (
                                    <div className="bg-amber-400/5 border border-amber-400/10 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Utensils className="w-4 h-4 text-amber-500" />
                                            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">Intolerancias Alimentarias</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {guest.hasIntolerance && (
                                                <div className="text-amber-200/90 text-[13px] bg-amber-400/10 px-2 py-1 rounded w-fit">
                                                    <strong className="text-amber-400">{guest.firstName || guest.name.split(' ')[0]}:</strong> {guest.intoleranceType}
                                                </div>
                                            )}
                                            {guest.companions?.filter(c => c.hasIntolerance).map((c, i) => (
                                                <div key={`mob-comp-int-${i}`} className="text-amber-200/90 text-[13px] bg-amber-400/10 px-2 py-1 rounded w-fit">
                                                    <strong className="text-amber-400">{c.name.split(' ')[0]}:</strong> {c.intoleranceType || 'Especial'}
                                                </div>
                                            ))}
                                            {guest.childrenDetail?.filter(c => c.hasIntolerance).map((c, i) => (
                                                <div key={`mob-child-int-${i}`} className="text-amber-200/90 text-[13px] bg-amber-400/10 px-2 py-1 rounded w-fit">
                                                    <strong className="text-amber-400">{c.name.split(' ')[0]}:</strong> {c.intoleranceType || 'Especial'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {guest.bus && guest.bus !== 'none' && (
                                    <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bus className="w-4 h-4 text-primary" />
                                            <span className="text-xs text-primary font-bold uppercase tracking-wider">Autobús</span>
                                        </div>
                                        <div className="text-white text-sm capitalize">{guest.bus}</div>
                                    </div>
                                )}

                                {guest.comment && (
                                    <div className="italic text-stone-400 bg-black/20 p-3 rounded-xl text-sm border-l-2 border-primary/30">
                                        "{guest.comment}"
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Guest List - Desktop Table Layout */}
                <div className="hidden md:block bg-[#121815] rounded-3xl shadow-xl border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableHead className="text-primary font-bold">Invitado / Familia</TableHead>
                                <TableHead className="text-primary font-bold">Asistencia</TableHead>
                                <TableHead className="text-primary font-bold">Intolerancias</TableHead>
                                <TableHead className="text-primary font-bold">Bus</TableHead>
                                <TableHead className="text-primary font-bold">Comentario</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guests.map((guest) => {
                                const hasFamily = (guest.companions && guest.companions.length > 0) || (guest.childrenDetail && guest.childrenDetail.length > 0);

                                return (
                                    <TableRow key={guest.id} className={`border-white/5 transition-colors ${hasFamily ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-white/5'}`}>
                                        <TableCell className="py-4">
                                            <div className="font-bold text-white text-base flex items-center justify-between">
                                                <span>{guest.name}</span>
                                                {hasFamily && <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wider">Grupo Familiar</Badge>}
                                            </div>

                                            {(guest.companions?.length || guest.childrenDetail?.length) ? (
                                                <div className="mt-2.5 flex flex-col gap-1.5 ml-2 border-l-2 border-primary/20 pl-3">
                                                    {guest.companions && guest.companions.map((c, i) => (
                                                        <div key={`comp-${i}`} className="text-sm text-stone-300 flex items-center gap-2">
                                                            <UserPlus className="w-3.5 h-3.5 text-primary/70" />
                                                            {c.name} {c.hasIntolerance && <span className="text-amber-400 text-[10px] uppercase tracking-wider ml-1 px-1.5 bg-amber-400/10 border border-amber-400/20 rounded">Dieta</span>}
                                                        </div>
                                                    ))}
                                                    {guest.childrenDetail && guest.childrenDetail.map((c, i) => (
                                                        <div key={`child-${i}`} className="text-sm text-stone-400 flex items-center gap-2">
                                                            <Baby className="w-3.5 h-3.5 text-blue-400/70" />
                                                            {c.name} {c.hasIntolerance && <span className="text-amber-400 text-[10px] uppercase tracking-wider ml-1 px-1.5 bg-amber-400/10 border border-amber-400/20 rounded">Dieta</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={(guest.ceremonyAttendance === 'yes' || guest.celebrationAttendance === 'yes') ? 'default' : 'destructive'} className="uppercase tracking-wider">
                                                CER: {guest.ceremonyAttendance === 'yes' ? 'SÍ' : (guest.ceremonyAttendance === 'no' ? 'NO' : '-')} | CEL: {guest.celebrationAttendance === 'yes' ? 'SÍ' : (guest.celebrationAttendance === 'no' ? 'NO' : '-')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5 text-xs">
                                                {guest.hasIntolerance && (
                                                    <div className="bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-1 rounded w-fit">
                                                        <strong>{guest.firstName || guest.name.split(' ')[0]}:</strong> {guest.intoleranceType}
                                                    </div>
                                                )}
                                                {guest.companions?.filter(c => c.hasIntolerance).map((c, i) => (
                                                    <div key={`comp-int-${i}`} className="bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-1 rounded w-fit">
                                                        <strong>{c.name.split(' ')[0]}:</strong> {c.intoleranceType || 'Especial'}
                                                    </div>
                                                ))}
                                                {guest.childrenDetail?.filter(c => c.hasIntolerance).map((c, i) => (
                                                    <div key={`child-int-${i}`} className="bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-1 rounded w-fit">
                                                        <strong>{c.name.split(' ')[0]}:</strong> {c.intoleranceType || 'Especial'}
                                                    </div>
                                                ))}
                                                {(!guest.hasIntolerance && !guest.companions?.some(c => c.hasIntolerance) && !guest.childrenDetail?.some(c => c.hasIntolerance)) && (
                                                    <span className="text-stone-600">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="uppercase text-xs font-semibold text-stone-400">{guest.bus === 'none' ? '-' : guest.bus}</TableCell>
                                        <TableCell className="max-w-[200px] truncate text-stone-500 italic" title={guest.comment}>
                                            {guest.comment || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-600 hover:text-red-400 hover:bg-red-400/10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-[#1a211e] border-white/10 text-stone-200">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-white">¿Borrar registro?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-stone-400">
                                                            Estás a punto de borrar a <span className="text-primary font-bold">{guest.name}</span> y a sus acompañantes.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-transparent border-white/10 text-stone-300 hover:bg-white/5 hover:text-white">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => guest.id && handleDelete(guest.id)} className="bg-red-900 text-red-100 hover:bg-red-800 border border-red-800">Borrar</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
