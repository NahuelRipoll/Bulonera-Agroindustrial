import type { Metadata } from "next";
import ContactoForm from "./ContactoForm";

export const metadata: Metadata = {
  title: "Contacto | Bulonera Agroindustrial",
  description:
    "Contactanos para consultas sobre productos y precios. Estamos en Rodeo del Medio, Maipú, Mendoza.",
};

export default function ContactoPage() {
  return <ContactoForm />;
}
