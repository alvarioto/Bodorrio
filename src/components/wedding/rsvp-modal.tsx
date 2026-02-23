"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addGuest, getGuestByName } from '@/services/rsvp';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, UserPlus, Sparkles, Baby, CheckCircle } from "lucide-react";

// Opciones para el desplegable de intolerancias
const INTOLERANCE_OPTIONS = [
  "Gluten",
  "Lactosa",
  "Frutos Secos",
  "Marisco",
  "Vegetariano",
  "Vegano",
  "Otras (especificar en comentarios)"
];

const childSchema = z.object({
  firstName: z.string().min(2, { message: "Nombre requerido" }),
  firstLastName: z.string().min(2, { message: "Primer apellido requerido" }),
  secondLastName: z.string().min(2, { message: "Segundo apellido requerido" }),
  hasIntolerance: z.enum(["yes", "no"]),
  intoleranceType: z.string().optional(),
}).refine((data) => {
  if (data.hasIntolerance === 'yes' && !data.intoleranceType) return false;
  return true;
}, { message: "Selecciona el tipo", path: ["intoleranceType"] });

const adultSchema = z.object({
  firstName: z.string().min(2, { message: "Nombre requerido" }),
  firstLastName: z.string().min(2, { message: "Primer apellido requerido" }),
  secondLastName: z.string().min(2, { message: "Segundo apellido requerido" }),
  hasIntolerance: z.enum(["yes", "no"]),
  intoleranceType: z.string().optional(),
}).refine((data) => {
  if (data.hasIntolerance === 'yes' && !data.intoleranceType) return false;
  return true;
}, { message: "Selecciona el tipo", path: ["intoleranceType"] });

const formSchema = z.object({
  // NOMBRE DIVIDIDO
  firstName: z.string().min(2, { message: "Tu nombre es obligatorio" }),
  firstLastName: z.string().min(2, { message: "Tu primer apellido es obligatorio" }),
  secondLastName: z.string().min(2, { message: "Tu segundo apellido es obligatorio" }),

  attendance: z.enum(["yes", "no"], {
    required_error: "¡Necesitamos saber si vienes!",
  }),

  // CAMPOS PRINCIPALES
  hasIntolerance: z.enum(["yes", "no"]).optional(),
  intoleranceType: z.string().optional(),

  // ACOMPAÑANTES (Array dinámico)
  hasCompanions: z.enum(["yes", "no"]).optional(),
  companions: z.array(adultSchema).optional(),

  // NIÑOS (Selector numérico + Array dinámico)
  hasChildren: z.enum(["yes", "no"]).optional(),
  childrenCount: z.string().optional(), // "1", "2", "3"...
  childrenDetail: z.array(childSchema).optional(),

  bus: z.enum(["none", "ida", "vuelta", "ambos"]).optional(),
  comment: z.string().optional(),
})
  .refine((data) => {
    if (data.hasIntolerance === 'yes' && !data.intoleranceType) {
      return false;
    }
    return true;
  }, {
    message: "Por favor, indícanos qué tipo de intolerancia tienes.",
    path: ["intoleranceType"],
  });

type RsvpModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'ceremony' | 'celebration' | null;
};

const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onOpenChange, type }) => {
  const { toast } = useToast();
  const [foundExistingGuest, setFoundExistingGuest] = useState<any>(null);
  const [successModalData, setSuccessModalData] = useState<{ title: string, description: string, warnings?: string[] } | null>(null);
  const [ignoredNames, setIgnoredNames] = useState<string[]>([]);
  const [acceptedNames, setAcceptedNames] = useState<string[]>([]);
  const isSubmittingRef = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      firstLastName: "",
      secondLastName: "",
      attendance: "yes",

      hasIntolerance: "no",

      hasCompanions: "no",
      companions: [],

      hasChildren: "no",
      childrenCount: "0",
      childrenDetail: [],

      bus: "none",
      comment: "",
    },
  });

  const { fields: companionFields, append: appendCompanion, remove: removeCompanion, replace: replaceCompanions } = useFieldArray({
    control: form.control,
    name: "companions",
  });

  const { fields: childFields, replace: replaceChildren } = useFieldArray({
    control: form.control,
    name: "childrenDetail",
  });

  const handleNameBlur = async () => {
    const fn = form.getValues("firstName") || "";
    const ln1 = form.getValues("firstLastName") || "";
    const ln2 = form.getValues("secondLastName") || "";

    if (fn.trim().length >= 2 && ln1.trim().length >= 2 && type) {
      const lastNames = `${ln1.trim()} ${ln2.trim()}`.trim();
      const existing = await getGuestByName(fn, lastNames, type);

      if (existing && !foundExistingGuest && !ignoredNames.includes(existing.name) && !acceptedNames.includes(existing.name) && !isSubmittingRef.current) {
        setFoundExistingGuest(existing);
      }
    }
  };

  const handleAcceptRestore = () => {
    if (!foundExistingGuest) return;
    const existing = foundExistingGuest;
    const fn = form.getValues("firstName") || existing.firstName;
    const ln1 = form.getValues("firstLastName");
    const ln2 = form.getValues("secondLastName");

    toast({
      title: "¡Datos recuperados!",
      description: "Revisa la información y edita lo que necesites antes de volver a guardar.",
    });

    const numChildren = existing.childrenDetail ? existing.childrenDetail.length : 0;

    let cAttendance = existing.ceremonyAttendance;
    if (type === 'celebration' && existing.celebrationAttendance) cAttendance = existing.celebrationAttendance;

    form.reset({
      firstName: existing.firstName || fn,
      firstLastName: ln1,
      secondLastName: ln2,
      attendance: cAttendance === 'no' ? 'no' : 'yes',
      hasIntolerance: existing.hasIntolerance ? "yes" : "no",
      intoleranceType: existing.intoleranceType || "",
      hasCompanions: (existing.companions && existing.companions.length > 0) ? "yes" : "no",
      companions: existing.companions ? existing.companions.map((c: any) => {
        const parts = c.name.split(' ');
        const cfn = parts[0];
        const cln1 = parts[1] || '';
        const cln2 = parts.slice(2).join(' ') || '';
        return {
          firstName: cfn,
          firstLastName: cln1,
          secondLastName: cln2,
          hasIntolerance: c.hasIntolerance ? "yes" : "no",
          intoleranceType: c.intoleranceType || "",
        };
      }) : [],
      hasChildren: numChildren > 0 ? "yes" : "no",
      childrenCount: numChildren.toString(),
      childrenDetail: existing.childrenDetail ? existing.childrenDetail.map((c: any) => {
        const parts = c.name.split(' ');
        const cfn = parts[0];
        const cln1 = parts[1] || '';
        const cln2 = parts.slice(2).join(' ') || '';
        return {
          firstName: cfn,
          firstLastName: cln1,
          secondLastName: cln2,
          hasIntolerance: c.hasIntolerance ? "yes" : "no",
          intoleranceType: c.intoleranceType || "",
        };
      }) : [],
      bus: existing.bus || "none",
      comment: existing.comment || "",
    });
    setAcceptedNames(prev => [...prev, existing.name]);
    setFoundExistingGuest(null);
  };

  const handleRejectRestore = () => {
    if (foundExistingGuest) {
      setIgnoredNames(prev => [...prev, foundExistingGuest.name]);
    }
    setFoundExistingGuest(null);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setFoundExistingGuest(null);
      setIgnoredNames([]);
      setAcceptedNames([]);
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!type) return;

    const fn = values.firstName || "";
    const ln1 = values.firstLastName || "";
    const ln2 = values.secondLastName || "";
    const searchLastNames = `${ln1.trim()} ${ln2.trim()}`.trim();

    if (fn.trim().length >= 2 && ln1.trim().length >= 2) {
      const existing = await getGuestByName(fn, searchLastNames, type);
      if (existing && !ignoredNames.includes(existing.name) && !acceptedNames.includes(existing.name)) {
        setFoundExistingGuest(existing);
        return; // Intercept submit to show the modal!
      }
    }

    isSubmittingRef.current = true;
    try {
      const lastNamesStr = searchLastNames;

      const payload: any = {
        firstName: values.firstName.trim(),
        lastName: lastNamesStr,
        name: `${values.firstName.trim()} ${lastNamesStr}`, // Guardamos concatenado también
        comment: values.comment,
      };

      if (type === 'ceremony') {
        payload.ceremonyAttendance = values.attendance;
      } else if (type === 'celebration') {
        payload.celebrationAttendance = values.attendance;
      }

      if (type === 'celebration' && values.attendance === 'yes') {
        payload.hasIntolerance = values.hasIntolerance === 'yes';
        if (payload.hasIntolerance) payload.intoleranceType = values.intoleranceType;

        if (values.hasCompanions === 'yes' && values.companions && values.companions.length > 0) {
          payload.hasCompanion = true;
          payload.companions = values.companions.map(c => {
            const lastNamesStr = `${c.firstLastName.trim()} ${c.secondLastName.trim()}`.trim();
            return {
              name: `${c.firstName.trim()} ${lastNamesStr}`,
              hasIntolerance: c.hasIntolerance === 'yes',
              intoleranceType: c.hasIntolerance === 'yes' ? c.intoleranceType : undefined
            };
          });
        } else {
          payload.hasCompanion = false;
          payload.companions = [];
        }

        // Niños
        if (values.hasChildren === 'yes' && values.childrenDetail && values.childrenDetail.length > 0) {
          payload.childrenDetail = values.childrenDetail.map(c => {
            const lastNamesStr = `${c.firstLastName.trim()} ${c.secondLastName.trim()}`.trim();
            return {
              name: `${c.firstName.trim()} ${lastNamesStr}`,
              hasIntolerance: c.hasIntolerance === 'yes',
              intoleranceType: c.hasIntolerance === 'yes' ? c.intoleranceType : undefined
            };
          });
          payload.children = `${values.childrenDetail.length} niños`; // Legacy string summary
        } else {
          payload.childrenDetail = [];
          payload.children = "";
        }

        payload.bus = values.bus;
      } else {
        // Valores por defecto para "No asiste" o "Solo ceremonia"
        payload.bus = 'none';
        payload.companions = [];
        payload.childrenDetail = [];
      }

      const result = await addGuest(payload);

      const successData = {
        title: result.isUpdate ? "¡Confirmación actualizada!" : "¡Gracias por confirmar!",
        description: result.isUpdate
          ? "Hemos guardado los nuevos cambios de tu asistencia correctamente."
          : (values.attendance === 'yes' ? "Qué alegría saber que vendrás. ¡Nos vemos pronto!" : "Te echaremos mucho de menos."),
        warnings: result?.warnings || []
      };

      setSuccessModalData(successData);

    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Error desconocido";

      if (msg.includes("Ya existe un registro")) {
        toast({
          variant: "destructive",
          title: "Registro duplicado",
          description: "Ya existe alguien con ese Nombre y Apellidos.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Ups, algo salió mal",
          description: msg,
        });
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Watchers para lógica condicional
  const watchAttendance = form.watch("attendance");
  const watchHasIntolerance = form.watch("hasIntolerance");
  const watchHasCompanions = form.watch("hasCompanions");
  const watchHasChildren = form.watch("hasChildren");
  const watchChildrenCount = form.watch("childrenCount");

  // Efecto para sincronizar el número de campos de niños
  useEffect(() => {
    const count = parseInt(watchChildrenCount || "0", 10);
    if (!isNaN(count) && count >= 0) {
      // Si el número seleccionado es diferente al número de campos actuales, actualizamos
      if (childFields.length !== count) {
        const newFields = Array(count).fill({ firstName: "", firstLastName: "", secondLastName: "", hasIntolerance: "no" });
        // Preservar datos ya escritos si reducimos el número? 
        // Para simplicidad, reemplazamos o ajustamos. Replace es más seguro.
        replaceChildren(newFields);
      }
    }
  }, [watchChildrenCount, replaceChildren]); // childFields.length en deps haría loop infinito, cuidado.

  if (!type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        <DialogTitle className="sr-only">Confirmar asistencia a la boda</DialogTitle>
        <DialogDescription className="sr-only">Formulario para confirmar asistencia al evento de boda.</DialogDescription>
        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-primary/50 text-center relative overflow-hidden">

          {/* OVERLAY SUB-MODAL */}
          {foundExistingGuest && (() => {
            const fn = form.getValues('firstName') || "";
            const ln1 = form.getValues('firstLastName') || "";
            const ln2 = form.getValues('secondLastName') || "";
            const currentFullName = `${fn.trim()} ${`${ln1.trim()} ${ln2.trim()}`.trim()}`.trim().toLowerCase();
            const existingName = foundExistingGuest.name.toLowerCase();
            const normalizeName = (n: string) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const isCompanion = normalizeName(currentFullName) !== normalizeName(existingName);

            return (
              <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-primary/20 rounded-2xl p-6 md:p-8 max-w-sm w-full space-y-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

                  <div className="text-primary w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center shadow-inner mb-2">
                    <Sparkles size={28} className="text-primary/80" />
                  </div>

                  <h4 className="font-headline text-2xl text-foreground tracking-tight">¡Te hemos encontrado!</h4>

                  <p className="text-muted-foreground text-sm font-body">
                    {isCompanion ? (
                      <>Estás incluido/a en la reserva principal a nombre de <strong className="text-primary">{foundExistingGuest.name}</strong>.</>
                    ) : (
                      <>Ya tenemos registrada tu asistencia previa a nombre de <strong className="text-primary">{foundExistingGuest.name}</strong>.</>
                    )}
                  </p>

                  <div className="bg-stone-50/80 border border-stone-200/60 p-4 rounded-xl text-sm space-y-2 font-body text-stone-700 shadow-sm text-left">
                    <div className="flex justify-between items-center border-b border-stone-200/50 pb-2">
                      <span className="font-semibold text-stone-900">Adultos confirmados:</span>
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">{(foundExistingGuest.companions?.length || 0) + 1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-900">Niños confirmados:</span>
                      <span className="bg-stone-200 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">{foundExistingGuest.childrenDetail?.length || 0}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 font-body leading-relaxed px-1">
                    {isCompanion
                      ? "Si quieres modificar algún plato o dato, puedes cargar la confirmación familiar ahora."
                      : "¿Quieres cargar los datos de la confirmación para añadir algo que se te olvidase?"}
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button onClick={handleAcceptRestore} className="w-full h-11 text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all">
                      Sí, cargar esta confirmación
                    </Button>
                    <Button onClick={handleRejectRestore} variant="ghost" className="w-full h-10 text-sm md:text-[15px] text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-all">
                      No, prefiero empezar de cero
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* SUCCESS MODAL OVERLAY */}
          {successModalData && (
            <div className="absolute inset-0 z-[60] bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-primary/20 rounded-2xl p-6 md:p-8 max-w-sm w-full space-y-5 text-center relative overflow-hidden flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

                <div className="text-green-600 w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-headline text-2xl text-stone-900 tracking-tight">{successModalData.title}</h4>
                  <p className="text-stone-500 text-sm font-body">{successModalData.description}</p>
                </div>

                {successModalData.warnings && successModalData.warnings.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm font-body text-primary shadow-sm text-center w-full space-y-2">
                    <div className="font-bold flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      ¡Vínculo Familiar Detectado!
                    </div>
                    {successModalData.warnings.map((w, i) => (
                      <p key={i} className="text-stone-700 leading-snug">{w}</p>
                    ))}
                  </div>
                )}

                <Button onClick={() => { setSuccessModalData(null); onOpenChange(false); }} className="w-full h-11 mt-2 text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all">
                  Cerrar y volver
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="font-headline text-3xl mb-2 text-foreground">
              {type === 'ceremony' ? 'Ceremonia Religiosa' : 'Celebración'}
            </h3>
            <p className="text-muted-foreground text-sm font-body">
              {type === 'ceremony'
                ? "¿Nos acompañarás en el 'Sí, quiero'?"
                : "¡Queremos celebrar contigo a lo grande!"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">

              {/* NOMBRE Y APELLIDOS DIVIDIDOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground font-body">Nombre <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Álvaro" {...field} className="bg-white border-border/60 rounded-xl" onBlur={(e) => { field.onBlur(); handleNameBlur(); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground font-body">Primer Apellido <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: García" {...field} className="bg-white border-border/60 rounded-xl" onBlur={(e) => { field.onBlur(); handleNameBlur(); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-foreground font-body">Segundo Apellido <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Pérez" {...field} value={field.value || ""} className="bg-white border-border/60 rounded-xl" onBlur={(e) => { field.onBlur(); handleNameBlur(); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ASISTENCIA */}
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-bold text-foreground font-body">¿Contamos contigo?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="yes" /></FormControl>
                          <Label className="font-semibold text-stone-900 font-body">¡Sí, allí estaré!</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="no" /></FormControl>
                          <Label className="font-semibold text-stone-900 font-body">No podré ir 🥺</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FORMULARIO EXTENDIDO */}
              {type === 'celebration' && watchAttendance === 'yes' && (
                <>
                  {/* INTOLERANCIAS PRINCIPAL */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="hasIntolerance"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-bold text-foreground font-body">¿Tu tienes alergias/intolerancias?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">Sí</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">No</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchHasIntolerance === 'yes' && (
                      <FormField
                        control={form.control}
                        name="intoleranceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-foreground font-body">Cuéntanos cuál</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-border/60 rounded-xl">
                                  <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INTOLERANCE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt} className="font-body">{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* SECCIÓN ACOMPAÑANTES (ADULTOS) */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="hasCompanions"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-bold text-foreground font-body">¿Vienes acompañado?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (val === 'yes' && companionFields.length === 0) appendCompanion({ firstName: "", firstLastName: "", secondLastName: "", hasIntolerance: "no" });
                                if (val === 'no') replaceCompanions([]);
                              }}
                              value={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">Sí</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">Solo/a</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchHasCompanions === 'yes' && (
                      <div className="pl-2 space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        {companionFields.map((field, index) => (
                          <div key={field.id} className="relative bg-white p-4 rounded-lg shadow-sm mb-4 border border-stone-100">
                            <div className="absolute right-2 top-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => removeCompanion(index)}
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <h4 className="font-headline text-sm text-primary mb-3 flex items-center gap-2">
                              <UserPlus className="w-4 h-4" /> Acompañante {index + 1}
                            </h4>
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FormField
                                  control={form.control}
                                  name={`companions.${index}.firstName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs font-semibold">Nombre <span className="text-destructive">*</span></FormLabel>
                                      <FormControl><Input {...field} placeholder="Nombre" className="bg-white border-border/60 rounded-xl h-9 text-sm" /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`companions.${index}.firstLastName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs font-semibold">1er Apellido <span className="text-destructive">*</span></FormLabel>
                                      <FormControl><Input {...field} placeholder="Apellidos" className="bg-white border-border/60 rounded-xl h-9 text-sm" /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`companions.${index}.secondLastName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs font-semibold">2º Apellido <span className="text-destructive">*</span></FormLabel>
                                      <FormControl><Input {...field} placeholder="Apellidos" className="bg-white border-border/60 rounded-xl h-9 text-sm" /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`companions.${index}.hasIntolerance`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-1">
                                      <FormLabel className="text-xs">¿Tiene intolerancias?</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-9 focus:ring-stone-500 bg-white border-border/60"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                          <SelectItem value="no">No</SelectItem>
                                          <SelectItem value="yes">Sí</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                                {form.watch(`companions.${index}.hasIntolerance`) === 'yes' && (
                                  <FormField
                                    control={form.control}
                                    name={`companions.${index}.intoleranceType`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-1">
                                        <FormLabel className="text-xs">tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="h-9 focus:ring-stone-500 bg-white border-border/60"><SelectValue placeholder="Tipo" /></SelectTrigger></FormControl>
                                          <SelectContent>
                                            {INTOLERANCE_OPTIONS.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendCompanion({ firstName: "", firstLastName: "", secondLastName: "", hasIntolerance: "no" })}
                          className="w-full border-dashed border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus-visible:ring-stone-500 bg-white"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Añadir otro acompañante
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN NIÑOS (CON SELECTOR NUMÉRICO) */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="hasChildren"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-bold text-foreground font-body">¿Vienes con niños?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (val === 'no') {
                                  form.setValue("childrenCount", "0");
                                  replaceChildren([]);
                                }
                              }}
                              value={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">Sí</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <Label className="font-semibold text-stone-900 font-body">No</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchHasChildren === 'yes' && (
                      <div className="space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <FormField
                          control={form.control}
                          name="childrenCount"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-sm font-semibold">¿Cuántos niños?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Selecciona cantidad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'Niño' : 'Niños'}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {childFields.map((field, index) => (
                          <div key={field.id} className="bg-white p-3 rounded-lg shadow-sm border border-stone-100 mt-2">
                            <h4 className="font-headline text-xs text-primary mb-2 flex items-center gap-2">
                              <Baby className="w-3 h-3" /> Niño/a {index + 1}
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <FormField
                                  control={form.control}
                                  name={`childrenDetail.${index}.firstName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} placeholder="Nombre" className="h-8 text-sm bg-white border-border/60 rounded-lg" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`childrenDetail.${index}.firstLastName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} placeholder="1er Apel." className="h-8 text-sm bg-white border-border/60 rounded-lg" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`childrenDetail.${index}.secondLastName`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} placeholder="2º Apel." className="h-8 text-sm bg-white border-border/60 rounded-lg" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <FormField
                                  control={form.control}
                                  name={`childrenDetail.${index}.hasIntolerance`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-[10px] whitespace-nowrap">¿Intolerancias?</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="h-7 text-xs focus:ring-stone-500 bg-white border-border/60"><SelectValue /></SelectTrigger></FormControl>
                                          <SelectContent>
                                            <SelectItem value="no">No</SelectItem>
                                            <SelectItem value="yes">Sí</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                {form.watch(`childrenDetail.${index}.hasIntolerance`) === 'yes' && (
                                  <FormField
                                    control={form.control}
                                    name={`childrenDetail.${index}.intoleranceType`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="h-7 text-xs focus:ring-stone-500 bg-white border-border/60"><SelectValue placeholder="Tipo" /></SelectTrigger></FormControl>
                                          <SelectContent>
                                            {INTOLERANCE_OPTIONS.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>


                  {/* AUTOBUS */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="bus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground font-body">Servicio de Autobús</FormLabel>
                          <div className="text-xs font-semibold text-stone-900 mb-2 font-body">Para que disfrutes de la fiesta sin preocuparte del coche.</div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-border/60 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-primary font-body">
                                <SelectValue placeholder="¿Vas a usar el autobús?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none" className="font-body">No, iré en mi coche</SelectItem>
                              <SelectItem value="ida" className="font-body">Solo Ida (Huelva -&gt; Hacienda)</SelectItem>
                              <SelectItem value="vuelta" className="font-body">Solo Vuelta (Hacienda -&gt; Huelva)</SelectItem>
                              <SelectItem value="ambos" className="font-body">Ida y Vuelta</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="border-t border-border/40 pt-4">
                    <FormLabel className="text-base font-bold text-foreground font-body">¿Algo más que debamos saber?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Déjanos un mensaje o canción sugerida..."
                        className="bg-white border-border/60 rounded-xl min-h-[80px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary font-body"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all py-6 text-lg font-headline tracking-wide uppercase font-bold"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : 'Enviar Confirmación'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpModal;
