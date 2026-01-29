"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface RsvpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Por favor, introduce tu nombre.' }),
  attendance: z.enum(['yes', 'no'], { required_error: 'Por favor, selecciona una opción.' }),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onOpenChange }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      comment: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('RSVP Data:', data);
    // Here you would typically send the data to a server/backend
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: "¡Gracias!",
      description: "Hemos recibido tu respuesta.",
    });
    setTimeout(() => {
        onOpenChange(false);
        // Reset form for next open
        setTimeout(() => {
            form.reset();
            setIsSubmitted(false);
        }, 500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-card border-border shadow-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Confirmar Asistencia</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Por favor, haznos saber si nos acompañarás.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre completo" {...field} className="rounded-xl"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿Vienes a la boda?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" id="yes"/>
                        </FormControl>
                        <Label htmlFor="yes">¡Sí, allí estaré!</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" id="no"/>
                        </FormControl>
                        <Label htmlFor="no">No podré asistir</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alergias, una canción que no puede faltar, o lo que quieras decirnos."
                      className="resize-none rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar respuesta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpModal;
