"use client";

import { useEffect, useState } from "react";
import {
  crearReunion,
  getHorariosDisponibles,
} from "@/services/agenda";
import { useNotifications } from "@/components/ui/NotificationProvider";
import { getWhatsappUrl } from "@/config/site";
import { getCategorias } from "@/services/categorias";
import HorariosDisponibles from "./HorariosDisponibles";

export default function PublicAgendaForm() {
  const { error: notifyError } = useNotifications();
  const [form, setForm] = useState({
    nombre: "",
    tipoProyecto: "",
    fecha: "",
  });
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    let activo = true;

    getCategorias()
      .then((data) => {
        if (activo) {
          setCategorias(data);
        }
      })
      .catch(() => {
        if (activo) {
          setCategorias([]);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const cargarHorarios = async (fecha) => {
    if (!fecha) {
      setHorariosDisponibles([]);
      setErrorHorarios(false);
      setCargandoHorarios(false);
      return;
    }

    setCargandoHorarios(true);
    setErrorHorarios(false);

    try {
      const horarios = await getHorariosDisponibles(fecha);
      setHorariosDisponibles(horarios);
    } catch {
      setHorariosDisponibles([]);
      setErrorHorarios(true);
    } finally {
      setCargandoHorarios(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "fecha") {
      setHoraSeleccionada("");
      cargarHorarios(value);
    }
  };

  const enviarWhatsApp = async () => {
    if (
      !form.nombre ||
      !form.tipoProyecto ||
      !form.fecha ||
      !horaSeleccionada
    ) {
      notifyError("completá nombre, tipo, fecha y horario");
      return;
    }

    setEnviando(true);

    try {
      await crearReunion({
        nombre: form.nombre,
        tipoProyecto: form.tipoProyecto,
        fecha: form.fecha,
        hora: horaSeleccionada,
      });
    } catch (error) {
      if (error.message === "error api: 409") {
        notifyError("ese horario acaba de ocuparse, elegí otro");
        setHoraSeleccionada("");
        await cargarHorarios(form.fecha);
        setEnviando(false);
        return;
      }

      if (error.message === "error api: 400") {
        notifyError("horario inválido");
        setEnviando(false);
        return;
      }

      notifyError("no pudimos agendar la reunión");
      setEnviando(false);
      return;
    }

    const texto = `hola, quiero agendar una reunión con rüf arquitectura.

nombre: ${form.nombre}
tipo de proyecto: ${form.tipoProyecto}
fecha: ${form.fecha}
hora: ${horaSeleccionada}

¿les queda disponible ese horario?`;

    const url = getWhatsappUrl(texto);
    window.open(url, "_blank");
    setEnviando(false);
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
          name="tipoProyecto"
          value={form.tipoProyecto}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/10 p-3"
        >
          <option value="">tipo de proyecto</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
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
            cargando={cargandoHorarios}
            error={errorHorarios}
            onSeleccionarHora={setHoraSeleccionada}
          />
        </div>

        <button
          type="button"
          onClick={enviarWhatsApp}
          disabled={enviando}
          className="w-full rounded-lg bg-primary py-3 text-white transition hover:opacity-90"
        >
          {enviando ? "agendando..." : "agendar por whatsapp"}
        </button>
      </div>
    </div>
  );
}
