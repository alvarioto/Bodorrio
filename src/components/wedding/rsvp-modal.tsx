"use client";

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
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
import { useForm } from "react-hook-form";
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
import { addGuest } from '@/services/rsvp';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Por favor, dinos tu nombre para poder ubicarte.",
  }),
  attendance: z.enum(["yes", "no"], {
    required_error: "¡Necesitamos saber si vienes!",
  }),

  // CAMPOS A RELLENAR SOLO SI VIENEN A LA CELEBRACIÓN O CEREMONIA
  // (La lógica condicional de visualización se hace en el render, 
  // pero Zod valida todo, así que usamos .optional() y .refine() abajo)

  hasIntolerance: z.enum(["yes", "no"]).optional(),
  intoleranceType: z.string().optional(),

  hasCompanion: z.enum(["yes", "no"]).optional(),
  companionName: z.string().optional(),
  companionHasIntolerance: z.enum(["yes", "no"]).optional(),
  companionIntoleranceType: z.string().optional(),

  children: z.string().optional(), // Nuevo campo

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
  })
  .refine((data) => {
    if (data.hasCompanion === 'yes' && !data.companionName) {
      return false;
    }
    return true;
  }, {
    message: "¿Cómo se llama tu acompañante?",
    path: ["companionName"],
  })
  .refine((data) => {
    if (data.companionHasIntolerance === 'yes' && !data.companionIntoleranceType) {
      return false;
    }
    return true;
  }, {
    message: "Indícanos la intolerancia de tu acompañante.",
    path: ["companionIntoleranceType"],
  });

type RsvpModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'ceremony' | 'celebration' | null;
};

const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onOpenChange, type }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      attendance: "yes",
      hasIntolerance: "no",
      hasCompanion: "no",
      companionHasIntolerance: "no",
      children: "",
      bus: "none",
      comment: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        attendance: "yes",
        hasIntolerance: "no",
        hasCompanion: "no",
        companionHasIntolerance: "no",
        children: "",
        bus: "none",
        comment: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!type) return;

    try {
      // Mapeamos los valores para asegurar que coinciden con la interfaz Guest
      // y limpiamos datos si el usuario marcó "no" en las opciones padre

      const payload: any = {
        rsvpType: type,
        name: values.name,
        attendance: values.attendance,
        comment: values.comment,
      };

      if (type === 'celebration' && values.attendance === 'yes') {
        payload.hasIntolerance = values.hasIntolerance === 'yes';
        if (payload.hasIntolerance) payload.intoleranceType = values.intoleranceType;

        payload.hasCompanion = values.hasCompanion === 'yes';
        if (payload.hasCompanion) {
          payload.companionName = values.companionName;
          payload.companionHasIntolerance = values.companionHasIntolerance === 'yes';
          if (payload.companionHasIntolerance) {
            payload.companionIntoleranceType = values.companionIntoleranceType;
          }
        }

        if (values.children) payload.children = values.children;

        payload.bus = values.bus;
      } else {
        // Valores por defecto seguros para la base de datos si es ceremonia o no asiste
        payload.bus = 'none';
        payload.hasIntolerance = false;
        payload.hasCompanion = false;
      }

      await addGuest(payload);

      toast({
        title: "¡Gracias por confirmar!",
        description: values.attendance === 'yes'
          ? "Qué alegría saber que vendrás. ¡Nos vemos pronto!"
          : "Te echaremos mucho de menos.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Ups, algo salió mal",
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const watchAttendance = form.watch("attendance");
  const watchHasIntolerance = form.watch("hasIntolerance");
  const watchHasCompanion = form.watch("hasCompanion");
  const watchCompanionHasIntolerance = form.watch("companionHasIntolerance");

  if (!type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary/50 text-center">
          <div className="text-center mb-6">
            <h3 className="font-headline text-3xl mb-2 text-foreground">
              {type === 'ceremony' ? 'Ceremonia Religiosa' : 'La Celebración'}
            </h3>
            <p className="text-muted-foreground text-sm font-body">
              {type === 'ceremony'
                ? "¿Nos acompañarás en el 'Sí, quiero'?"
                : "¡Queremos celebrar contigo a lo grande!"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">

              {/* NOMBRE */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-foreground font-body">Tu Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre y apellidos"
                        {...field}
                        className="bg-white border-border/60 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary font-body"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="yes" /></FormControl>
                          <Label className="font-normal font-body">¡Sí, allí estaré!</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="no" /></FormControl>
                          <Label className="font-normal font-body">No podré ir :(</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FORMULARIO EXTENDIDO SOLO PARA CELEBRACIÓN Y SI ASISTE */}
              {type === 'celebration' && watchAttendance === 'yes' && (
                <>
                  {/* INTOLERANCIAS PRINCIPAL */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="hasIntolerance"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-bold text-foreground font-body">¿Tienes alguna alergia o intolerancia?</FormLabel>
                          <div className="text-xs text-muted-foreground mb-2 font-body">Queremos que disfrutes del menú sin preocupaciones.</div>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <Label className="font-normal font-body">Sí, tengo</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <Label className="font-normal font-body">Ninguna</Label>
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
                                <SelectTrigger className="bg-white border-border/60 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-primary font-body">
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

                  {/* ACOMPAÑANTE */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="hasCompanion"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-bold text-foreground font-body">¿Vienes con pareja/acompañante?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <Label className="font-normal font-body">Sí, voy acompañado/a</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <Label className="font-normal font-body">Voy solo/a</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchHasCompanion === 'yes' && (
                      <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                        <FormField
                          control={form.control}
                          name="companionName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm text-foreground font-body">Nombre de tu acompañante</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre y apellidos"
                                  {...field}
                                  className="bg-white border-border/60 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary font-body"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companionHasIntolerance"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm text-foreground font-body">¿Tu acompañante tiene alergias?</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                    <Label className="font-normal font-body">Sí</Label>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                    <Label className="font-normal font-body">No</Label>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {watchCompanionHasIntolerance === 'yes' && (
                          <FormField
                            control={form.control}
                            name="companionIntoleranceType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-foreground font-body">¿Cuál?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white border-border/60 rounded-xl focus:ring-0 focus:ring-offset-0 focus:border-primary font-body">
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
                    )}
                  </div>

                  {/* NIÑOS (NUEVO) */}
                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem className="border-t border-border/40 pt-4">
                        <FormLabel className="text-base font-bold text-foreground font-body">¿Vienes con peques?</FormLabel>
                        <div className="text-xs text-muted-foreground mb-2 font-body">Indícanos cuántos y si necesitan trona o menú infantil.</div>
                        <FormControl>
                          <Input
                            placeholder="Ej: 2 niños (3 y 5 años), necesitan 1 trona"
                            className="bg-white border-border/60 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary font-body"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AUTOBUS */}
                  <div className="space-y-4 border-t border-border/40 pt-4">
                    <FormField
                      control={form.control}
                      name="bus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground font-body">Servicio de Autobús</FormLabel>
                          <div className="text-xs text-muted-foreground mb-2 font-body">Para que disfrutes de la fiesta sin preocuparte del coche.</div>
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
