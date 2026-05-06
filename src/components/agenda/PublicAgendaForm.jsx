"use client";

import { useMemo, useState } from "react";
import { getHorariosDisponibles } from "@/data/agendaMock";
import HorariosDisponibles from "./HorariosDisponibles";

export default function PublicAgendaForm({
  reuniones,
  bloqueos,
  horariosBase,
}) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    fecha: "",
  });
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const horariosDisponibles = useMemo(
    () =>
      getHorariosDisponibles(
        form.fecha,
        reuniones,
        bloqueos,
        horariosBase
      ),
    [form.fecha, reuniones, bloqueos, horariosBase]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "fecha") {
      setHoraSeleccionada("");
    }
  };

  const enviarWhatsApp = () => {
    if (!form.nombre || !form.tipo || !form.fecha || !horaSeleccionada) {
      alert("completá nombre, tipo, fecha y horario");
      return;
    }

    const reunionSimulada = {
      id: `tmp-${Date.now()}`,
      nombre: form.nombre,
      tipoProyecto: form.tipo,
      fecha: form.fecha,
      hora: horaSeleccionada,
      estado: "pendiente",
    };

    console.log("reunion simulada", reunionSimulada);
    alert("reunión simulada lista para enviar");

    const numero = "5491176619112";
    const texto = `hola, quiero agendar una reunión con rüf arquitectura.

nombre: ${form.nombre}
tipo de proyecto: ${form.tipo}
fecha: ${form.fecha}
hora: ${horaSeleccionada}

¿les queda disponible ese horario?`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-lg rounded-xl border border-black/5 bg-white p-5 shadow-sm sm:p-8">
      <h1 className="mb-6 text-2xl text-primary">agendar reunión</h1>

      <div className="space-y-5">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          placeholder="tu nombre"
          onChange={handleChange}
          className="w-full rounded-lg border border-black/10 p-3"
        />

        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/10 p-3"
        >
          <option value="">tipo de proyecto</option>
          <option value="casa">casa</option>
          <option value="interior">interior</option>
          <option value="mueble">mueble</option>
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/10 p-3"
        />

        <div className="space-y-3">
          <p className="text-sm text-gray-500">horarios disponibles</p>

          <HorariosDisponibles
            fecha={form.fecha}
            horariosDisponibles={horariosDisponibles}
            horaSeleccionada={horaSeleccionada}
            onSeleccionarHora={setHoraSeleccionada}
          />
        </div>

        <button
          type="button"
          onClick={enviarWhatsApp}
          className="w-full rounded-lg bg-primary py-3 text-white transition hover:opacity-90"
        >
          agendar por whatsapp
        </button>
      </div>
    </div>
  );
}
