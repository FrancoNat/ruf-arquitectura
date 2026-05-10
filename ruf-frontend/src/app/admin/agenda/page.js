"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCalendar from "@/components/admin/AdminCalendar";
import DayDetailPanel from "@/components/admin/DayDetailPanel";
import PendingReunionesList from "@/components/admin/PendingReunionesList";
import { useNotifications } from "@/components/ui/NotificationProvider";
import {
  createBloqueo,
  deleteBloqueo,
  deleteReunion,
  getAdminBloqueos,
  getAdminReuniones,
  getHorariosBase,
  updateEstadoReunion,
} from "@/services/agenda";

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(fecha) {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function AdminAgendaPage() {
  const { error: notifyError, success, promptDialog } = useNotifications();
  const today = useMemo(() => new Date(), []);
  const [reuniones, setReuniones] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [horariosBase, setHorariosBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const selectedDateKey = formatDateKey(selectedDate);

  useEffect(() => {
    let activo = true;

    Promise.all([getHorariosBase(), getAdminReuniones(), getAdminBloqueos()])
      .then(([horarios, reunionesData, bloqueosData]) => {
        if (!activo) return;
        setHorariosBase(horarios);
        setReuniones(reunionesData);
        setBloqueos(bloqueosData);
        setError(false);
      })
      .catch(() => {
        if (!activo) return;
        setHorariosBase([]);
        setReuniones([]);
        setBloqueos([]);
        setError(true);
      })
      .finally(() => {
        if (!activo) return;
        setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

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

  const reunionesPendientes = useMemo(
    () =>
      reuniones
        .filter((reunion) => reunion.estado === "pendiente")
        .sort((a, b) => {
          const fechaCompare = a.fecha.localeCompare(b.fecha);
          return fechaCompare !== 0 ? fechaCompare : a.hora.localeCompare(b.hora);
        }),
    [reuniones]
  );

  const horariosDisponibles = useMemo(
    () => {
      const ocupadosPorReunion = reuniones
        .filter(
          (reunion) =>
            reunion.fecha === selectedDateKey &&
            (reunion.estado === "pendiente" || reunion.estado === "confirmada")
        )
        .map((reunion) => reunion.hora);

      const horariosBloqueados = bloqueos
        .filter((bloqueo) => bloqueo.fecha === selectedDateKey)
        .map((bloqueo) => bloqueo.hora);

      return horariosBase.filter(
        (hora) =>
          !ocupadosPorReunion.includes(hora) &&
          !horariosBloqueados.includes(hora)
      );
    },
    [selectedDateKey, reuniones, bloqueos, horariosBase]
  );

  const confirmarReunion = async (id) => {
    try {
      const reunionActualizada = await updateEstadoReunion(id, "confirmada");
      setReuniones((prev) =>
        prev.map((reunion) =>
          reunion.id === id ? reunionActualizada : reunion
        )
      );
      success("reunión confirmada");
    } catch {
      notifyError("no pudimos confirmar la reunión");
    }
  };

  const cancelarReunion = async (id) => {
    try {
      const reunionActualizada = await updateEstadoReunion(id, "cancelada");
      setReuniones((prev) =>
        prev.map((reunion) =>
          reunion.id === id ? reunionActualizada : reunion
        )
      );
      success("reunión cancelada");
    } catch {
      notifyError("no pudimos cancelar la reunión");
    }
  };

  const eliminarReunion = async (id) => {
    try {
      await deleteReunion(id);
      setReuniones((prev) => prev.filter((reunion) => reunion.id !== id));
      success("reunión eliminada");
    } catch {
      notifyError("no pudimos eliminar la reunión");
    }
  };

  const bloquearHorario = async (hora) => {
    const motivo = await promptDialog({
      title: "bloquear horario",
      message: `indicá el motivo para bloquear el horario ${hora}`,
      label: "motivo del bloqueo",
      placeholder: "opcional",
      confirmLabel: "bloquear",
    });

    try {
      const nuevoBloqueo = await createBloqueo({
        fecha: selectedDateKey,
        hora,
        motivo: motivo || "bloqueo manual",
      });
      setBloqueos((prev) => [...prev, nuevoBloqueo]);
      success("horario bloqueado");
    } catch {
      notifyError("no pudimos bloquear el horario");
    }
  };

  const liberarHorario = async (id) => {
    try {
      await deleteBloqueo(id);
      setBloqueos((prev) => prev.filter((bloqueo) => bloqueo.id !== id));
      success("horario liberado");
    } catch {
      notifyError("no pudimos liberar el horario");
    }
  };

  const seleccionarFecha = (fecha) => {
    const nuevaFecha = parseDateKey(fecha);
    setSelectedDate(nuevaFecha);
    setCurrentMonth(new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), 1));
  };

  return (
    <AdminLayout
      titulo="agenda"
      descripcion="visualizá el calendario mensual, revisá reuniones y controlá la disponibilidad por día."
    >
      {loading ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
          cargando agenda...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-8 text-sm text-text/60">
          no pudimos cargar la agenda
        </div>
      ) : (
        <>
          <PendingReunionesList
            reuniones={reunionesPendientes}
            onSelectFecha={seleccionarFecha}
            onConfirmarReunion={confirmarReunion}
            onCancelarReunion={cancelarReunion}
            onEliminarReunion={eliminarReunion}
          />

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
        </>
      )}
    </AdminLayout>
  );
}
