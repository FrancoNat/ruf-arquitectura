import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://rufarquitectura.com"),
  title: "rüf arquitectura | arquitectura e interiorismo online",
  description:
    "estudio de arquitectura en buenos aires, argentina. desarrollamos proyectos de arquitectura, interiorismo y muebles a medida con atención online.",
  keywords: [
    "arquitectura",
    "interiorismo",
    "muebles a medida",
    "arquitectura online",
    "estudio de arquitectura buenos aires",
    "arquitectas argentina",
  ],
  openGraph: {
    title: "rüf arquitectura",
    description:
      "arquitectura, interiorismo y muebles a medida con atención online.",
    url: "https://rufarquitectura.com",
    siteName: "rüf arquitectura",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rüf arquitectura",
    description: "arquitectura, interiorismo y muebles a medida.",
  },
  icons: {
    icon: "/images/logos/ruf-full-marron.png",
    shortcut: "/images/logos/ruf-full-marron.png",
    apple: "/images/logos/ruf-full-marron.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
