import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Proyectos from "../components/Proyectos";
import QuienesSomos from "../components/QuienesSomos";
import Testimonios from "../components/Testimonios";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Proyectos />
      <Testimonios />
      <QuienesSomos />
    </main>
  );
}
