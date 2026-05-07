import Navbar from "../../components/Navbar";
import PublicAgendaForm from "@/components/agenda/PublicAgendaForm";

export default function Agenda() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="min-h-screen bg-background px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto flex justify-center">
          <PublicAgendaForm />
        </div>
      </main>
    </>
  );
}
