"use client";

import Navbar from "../../components/Navbar";
import PublicAgendaForm from "@/components/agenda/PublicAgendaForm";
import {
  bloqueosMock,
  horariosBase,
  reunionesMock,
} from "@/data/agendaMock";

export default function Agenda() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="min-h-screen bg-background px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto flex justify-center">
          <PublicAgendaForm
            reuniones={reunionesMock}
            bloqueos={bloqueosMock}
            horariosBase={horariosBase}
          />
        </div>
      </main>
    </>
  );
}
