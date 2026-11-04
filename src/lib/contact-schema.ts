import { z } from "zod";

const singleLine = (max: number) => z.string().trim().max(max, `Limitez ce champ à ${max} caractères.`).refine(value => !/[\r\n\x00-\x1F\x7F]/.test(value), "Ce champ contient des caractères non autorisés.");

export const contactSchema = z.object({
  name: singleLine(100).refine(value => value.length >= 2, "Indiquez votre nom et prénom."),
  company: singleLine(150).refine(value => value.length >= 2, "Indiquez le nom de votre entreprise."),
  email: z.string().trim().max(254).email("Indiquez une adresse email valide."),
  phone: z.string().trim().max(32, "Le numéro est trop long.").refine(value => !value || (/^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 6), "Indiquez un numéro valide ou laissez ce champ vide."),
  message: z.string().trim().min(20, "Décrivez votre besoin en au moins 20 caractères.").max(4000, "Limitez votre message à 4 000 caractères.").refine(value => !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(value), "Le message contient des caractères non autorisés."),
  privacy: z.boolean().refine(value => value, "Confirmez avoir pris connaissance de la politique de confidentialité."),
  website: z.string().max(0, "Soumission non autorisée."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;
export function contactErrors(error: z.ZodError): ContactErrors {
  const errors: ContactErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
