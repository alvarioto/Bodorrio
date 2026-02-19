"use client";

import React, { useState, useEffect } from 'react';
import { getGuests, Guest, deleteGuest } from '@/services/rsvp';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lock, Download, RefreshCw, Bus, Utensils, Baby, Trash2, Home, UserPlus, FileDown } from 'lucide-react';
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
        const stats = {
            total: data.length,
            ceremony: data.filter(g => g.rsvpType === 'ceremony' && g.attendance === 'yes').length,
            celebration: data.filter(g => g.rsvpType === 'celebration' && g.attendance === 'yes').length,
            busIda: data.filter(g => (g.bus === 'ida' || g.bus === 'ambos') && g.attendance === 'yes').length,
            busVuelta: data.filter(g => (g.bus === 'vuelta' || g.bus === 'ambos') && g.attendance === 'yes').length,
            intolerances: data.filter(g => (g.hasIntolerance || g.companionHasIntolerance) && g.attendance === 'yes').length,
            children: data.filter(g => g.children && g.children.trim() !== "").length,
        };
        data.forEach(g => {
            if (g.rsvpType === 'celebration' && g.attendance === 'yes' && g.hasCompanion) {
                stats.celebration++;
                if (g.bus === 'ida' || g.bus === 'ambos') stats.busIda++;
                if (g.bus === 'vuelta' || g.bus === 'ambos') stats.busVuelta++;
            }
        });
        setStats(stats);
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
                                            {guest.createdAt?.toDate().toLocaleDateString()} · {guest.createdAt?.toDate().toLocaleTimeString().slice(0, 5)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={guest.attendance === 'yes' ? 'default' : 'destructive'} className="uppercase text-[10px] tracking-wider">
                                            {guest.attendance === 'yes' ? 'Asiste' : 'No asiste'}
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
                                {guest.hasCompanion && (
                                    <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <UserPlus className="w-4 h-4 text-primary mt-0.5" />
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-stone-500 mb-0.5">Acompañante</div>
                                            <div className="font-semibold text-white">{guest.companionName}</div>
                                            {guest.companionHasIntolerance && (
                                                <div className="text-amber-400 text-xs mt-1">⚠️ {guest.companionIntoleranceType}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    {(guest.hasIntolerance) && (
                                        <div className="bg-amber-900/10 border border-amber-900/20 p-2 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Utensils className="w-3 h-3 text-amber-500" />
                                                <span className="text-xs text-amber-500 font-bold uppercase">Intolerancia</span>
                                            </div>
                                            <div className="text-amber-200 text-xs">{guest.intoleranceType}</div>
                                        </div>
                                    )}
                                    {guest.children && (
                                        <div className="bg-blue-900/10 border border-blue-900/20 p-2 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Baby className="w-3 h-3 text-blue-400" />
                                                <span className="text-xs text-blue-400 font-bold uppercase">Niños</span>
                                            </div>
                                            <div className="text-blue-200 text-xs">{guest.children}</div>
                                        </div>
                                    )}
                                    {guest.bus && guest.bus !== 'none' && (
                                        <div className="bg-primary/5 border border-primary/10 p-2 rounded-lg col-span-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Bus className="w-3 h-3 text-primary" />
                                                <span className="text-xs text-primary font-bold uppercase">Autobús</span>
                                            </div>
                                            <div className="text-white text-xs capitalize">{guest.bus}</div>
                                        </div>
                                    )}
                                </div>

                                {guest.comment && (
                                    <div className="italic text-stone-400 bg-black/20 p-3 rounded-md text-xs border-l-2 border-primary/30">
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
                                <TableHead className="text-primary font-bold">Nombre</TableHead>
                                <TableHead className="text-primary font-bold">Asistencia</TableHead>
                                <TableHead className="text-primary font-bold">Acompañante</TableHead>
                                <TableHead className="text-primary font-bold">Intolerancias</TableHead>
                                <TableHead className="text-primary font-bold">Bus</TableHead>
                                <TableHead className="text-primary font-bold">Comentario</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guests.map((guest) => (
                                <TableRow key={guest.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-bold text-white text-base py-4">{guest.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={guest.attendance === 'yes' ? 'default' : 'destructive'} className="uppercase tracking-wider">
                                            {guest.attendance === 'yes' ? 'SÍ' : 'NO'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {guest.hasCompanion ? (
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">{guest.companionName}</span>
                                                {guest.companionHasIntolerance && (
                                                    <span className="text-xs text-amber-500">⚠️ {guest.companionIntoleranceType}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-stone-600">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {guest.hasIntolerance ? (
                                            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-500">{guest.intoleranceType}</Badge>
                                        ) : (
                                            <span className="text-stone-600">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="uppercase text-xs font-semibold text-stone-400">{guest.bus === 'none' ? '-' : guest.bus}</TableCell>
                                    <TableCell className="max-w-[200px] truncate text-stone-500 italic" title={guest.comment}>
                                        {guest.comment}
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
                                                        Estás a punto de borrar a <span className="text-primary font-bold">{guest.name}</span>.
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
