"use client";

const dayNames = ["lu", "ma", "mi", "ju", "vi", "sa", "do"];
const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDate(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

function buildCalendarDays(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const offset = (firstDay.getDay() + 6) % 7;
  const total = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < offset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= total; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

export default function AdminCalendar({
  selectedDate,
  onSelectDate,
  currentMonth,
  setCurrentMonth,
  reuniones,
  bloqueos,
}) {
  const today = new Date();
  const days = buildCalendarDays(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/60">
            calendario
          </p>
          <h2 className="mt-2 text-2xl font-light text-primary">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-xl border border-primary/15 px-4 py-3 text-sm text-primary transition hover:bg-background"
          >
            mes anterior
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-xl bg-primary px-4 py-3 text-sm text-white transition hover:opacity-85"
          >
            mes siguiente
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="pb-2 text-center text-xs uppercase tracking-[0.16em] text-primary/55"
          >
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="min-h-24 rounded-xl bg-transparent" />;
          }

          const dateKey = formatDateKey(date);
          const reunionesCount = reuniones.filter(
            (reunion) => reunion.fecha === dateKey
          ).length;
          const bloqueosCount = bloqueos.filter(
            (bloqueo) => bloqueo.fecha === dateKey
          ).length;

          const selected = isSameDate(date, selectedDate);
          const isToday = isSameDate(date, today);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`min-h-24 rounded-xl border p-3 text-left transition ${
                selected
                  ? "border-primary bg-background"
                  : "border-black/5 bg-background/40 hover:border-primary/30 hover:bg-background"
              } ${isToday ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-primary">{date.getDate()}</span>
                {isToday ? (
                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] text-white">
                    hoy
                  </span>
                ) : null}
              </div>

              <div className="mt-4 space-y-2">
                {reunionesCount > 0 ? (
                  <div className="rounded-lg bg-white px-2 py-1 text-[11px] text-text/70">
                    reuniones: {reunionesCount}
                  </div>
                ) : null}

                {bloqueosCount > 0 ? (
                  <div className="rounded-lg bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                    bloqueos: {bloqueosCount}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
