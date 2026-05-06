import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Proyectos from "../components/Proyectos";
import QuienesSomos from "../components/QuienesSomos";
import Testimonios from "../components/Testimonios";

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
