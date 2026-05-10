"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCalendar from "@/components/admin/AdminCalendar";
import DayDetailPanel from "@/components/admin/DayDetailPanel";
import DayDisablePanel from "@/components/admin/DayDisablePanel";
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

function getDateRangeKeys(desde, hasta) {
  const inicio = parseDateKey(desde);
  const fin = parseDateKey(hasta);
  const start = inicio <= fin ? inicio : fin;
  const end = inicio <= fin ? fin : inicio;
  const keys = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    keys.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

export default function AdminAgendaPage() {
  const { error: notifyError, success, promptDialog } = useNotifications();
  const today = useMemo(() => new Date(), []);
  const [reuniones, setReuniones] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [horariosBase, setHorariosBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [daySelectionMode, setDaySelectionMode] = useState(false);
  const [selectedDayKeys, setSelectedDayKeys] = useState([]);
  const [savingDays, setSavingDays] = useState(false);
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

  const toggleDayKey = (dateKey) => {
    setSelectedDayKeys((prev) =>
      prev.includes(dateKey)
        ? prev.filter((item) => item !== dateKey)
        : [...prev, dateKey].sort()
    );
  };

  const agregarRangoDias = useCallback((desde, hasta) => {
    const keys = getDateRangeKeys(desde, hasta);
    setSelectedDayKeys((prev) => [...new Set([...prev, ...keys])].sort());
  }, []);

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

  const desactivarDias = async () => {
    if (selectedDayKeys.length === 0) {
      notifyError("seleccioná al menos un día");
      return false;
    }

    const bloqueosExistentes = new Set(
      bloqueos.map((bloqueo) => `${bloqueo.fecha}-${bloqueo.hora}`)
    );
    const horariosOcupadosPorReunion = new Set(
      reuniones
        .filter(
          (reunion) =>
            selectedDayKeys.includes(reunion.fecha) &&
            (reunion.estado === "pendiente" || reunion.estado === "confirmada")
        )
        .map((reunion) => `${reunion.fecha}-${reunion.hora}`)
    );

    const bloqueosACrear = selectedDayKeys.flatMap((fecha) =>
      horariosBase
        .filter(
          (hora) =>
            !bloqueosExistentes.has(`${fecha}-${hora}`) &&
            !horariosOcupadosPorReunion.has(`${fecha}-${hora}`)
        )
        .map((hora) => ({ fecha, hora, motivo: "día desactivado" }))
    );

    if (bloqueosACrear.length === 0) {
      notifyError("no quedan horarios disponibles para bloquear en esos días");
      return false;
    }

    try {
      setSavingDays(true);
      const nuevosBloqueos = await Promise.all(
        bloqueosACrear.map((bloqueo) => createBloqueo(bloqueo))
      );
      setBloqueos((prev) => [...prev, ...nuevosBloqueos]);
      setSelectedDayKeys([]);
      setDaySelectionMode(false);
      success("día(s) desactivado(s)");
      return true;
    } catch {
      notifyError("no pudimos desactivar los días seleccionados");
      return false;
    } finally {
      setSavingDays(false);
    }
  };

  const desbloquearDias = async () => {
    if (selectedDayKeys.length === 0) {
      notifyError("seleccioná al menos un día");
      return false;
    }

    const bloqueosDeDias = bloqueos.filter(
      (bloqueo) =>
        selectedDayKeys.includes(bloqueo.fecha) &&
        bloqueo.motivo === "día desactivado"
    );

    if (bloqueosDeDias.length === 0) {
      notifyError("no hay días desactivados para desbloquear en la selección");
      return false;
    }

    try {
      setSavingDays(true);
      await Promise.all(
        bloqueosDeDias.map((bloqueo) => deleteBloqueo(bloqueo.id))
      );
      setBloqueos((prev) =>
        prev.filter(
          (bloqueo) =>
            !bloqueosDeDias.some((item) => item.id === bloqueo.id)
        )
      );
      setSelectedDayKeys([]);
      setDaySelectionMode(false);
      success("día(s) desbloqueado(s)");
      return true;
    } catch {
      notifyError("no pudimos desbloquear los días seleccionados");
      return false;
    } finally {
      setSavingDays(false);
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
            multiSelectMode={daySelectionMode}
            selectedDateKeys={selectedDayKeys}
            onToggleDateKey={toggleDayKey}
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

          <DayDisablePanel
            selectionMode={daySelectionMode}
            selectedDates={selectedDayKeys}
            saving={savingDays}
            onToggleSelectionMode={() => setDaySelectionMode((prev) => !prev)}
            onAddRange={agregarRangoDias}
            onSave={desactivarDias}
            onUnlock={desbloquearDias}
          />
        </>
      )}
    </AdminLayout>
  );
}
