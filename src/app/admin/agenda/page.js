"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCalendar from "@/components/admin/AdminCalendar";
import DayDetailPanel from "@/components/admin/DayDetailPanel";
import {
  bloqueosMock,
  getHorariosDisponibles,
  horariosBase,
  reunionesMock,
} from "@/data/agendaMock";

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminAgendaPage() {
  const [reuniones, setReuniones] = useState(reunionesMock);
  const [bloqueos, setBloqueos] = useState(bloqueosMock);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 10));

  const selectedDateKey = formatDateKey(selectedDate);

  const reunionesDelDia = useMemo(
    () =>
      reuniones
        .filter((reunion) => reunion.fecha === selectedDateKey)
        .sort((a, b) => a.hora.localeCompare(b.hora)),
    [reuniones, selectedDateKey]
  );

  const bloqueosDelDia = useMemo(
    () =>
      bloqueos
        .filter((bloqueo) => bloqueo.fecha === selectedDateKey)
        .sort((a, b) => a.hora.localeCompare(b.hora)),
    [bloqueos, selectedDateKey]
  );

  const horariosDisponibles = useMemo(
    () =>
      getHorariosDisponibles(
        selectedDateKey,
        reuniones,
        bloqueos,
        horariosBase
      ),
    [selectedDateKey, reuniones, bloqueos]
  );

  const confirmarReunion = (id) => {
    setReuniones((prev) =>
      prev.map((reunion) =>
        reunion.id === id ? { ...reunion, estado: "confirmada" } : reunion
      )
    );
  };

  const cancelarReunion = (id) => {
    setReuniones((prev) =>
      prev.map((reunion) =>
        reunion.id === id ? { ...reunion, estado: "cancelada" } : reunion
      )
    );
  };

  const eliminarReunion = (id) => {
    setReuniones((prev) => prev.filter((reunion) => reunion.id !== id));
  };

  const bloquearHorario = (hora) => {
    const motivo = window.prompt("motivo del bloqueo");

    if (!motivo) {
      return;
    }

    const nuevoBloqueo = {
      id: `b-${Date.now()}`,
      fecha: selectedDateKey,
      hora,
      motivo,
    };

    setBloqueos((prev) => [...prev, nuevoBloqueo]);
    console.log("bloqueo horario", nuevoBloqueo);
    alert("horario bloqueado");
  };

  const liberarHorario = (id) => {
    setBloqueos((prev) => prev.filter((bloqueo) => bloqueo.id !== id));
    console.log("liberar horario", id);
    alert("horario liberado");
  };

  return (
    <AdminLayout
      titulo="agenda"
      descripcion="visualizá el calendario mensual, revisá reuniones y controlá la disponibilidad por día."
    >
      <AdminCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        reuniones={reuniones}
        bloqueos={bloqueos}
      />

      <DayDetailPanel
        selectedDate={selectedDate}
        reuniones={reunionesDelDia}
        bloqueos={bloqueosDelDia}
        horariosBase={horariosBase}
        horariosDisponibles={horariosDisponibles}
        onConfirmarReunion={confirmarReunion}
        onCancelarReunion={cancelarReunion}
        onEliminarReunion={eliminarReunion}
        onBloquearHorario={bloquearHorario}
        onLiberarHorario={liberarHorario}
      />
    </AdminLayout>
  );
}
