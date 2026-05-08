import AdminSidebar from "./AdminSidebar";
import AdminGuard from "./AdminGuard";

export default function AdminLayout({
  titulo,
  descripcion,
  acciones,
  topContent,
  children,
}) {
  return (
    <AdminGuard>
      <main className="bg-[#f8f4ef] pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AdminSidebar />
          </div>

          <section className="space-y-6">
            {topContent ? <div>{topContent}</div> : null}

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-light text-primary">{titulo}</h1>
                  {descripcion ? (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text/70">
                      {descripcion}
                    </p>
                  ) : null}
                </div>

                {acciones ? (
                  <div className="flex flex-wrap gap-3">{acciones}</div>
                ) : null}
              </div>
            </div>

            {children}
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
