import Link from "next/link";
import Navbar from "../../components/Navbar";

const preguntas = [
  {
    pregunta: "¿qué servicio elijo?",
    respuesta: [
      "cada servicio está pensado para distintos tipos de necesidades y espacios. Podés elegir según lo que necesites resolver: un ambiente específico, un espacio integrado o una consulta puntual para tomar decisiones.",
    ],
  },
  {
    pregunta:
      "¿cómo es el proceso de trabajo?",
    respuesta: [
      "una vez que nos contactes coordinamos una primera instancia para conocer el proyecto, entender tus necesidades y evaluar el alcance del trabajo.",
      "según el tipo de proyecto, podemos solicitar previamente fotos, medidas, planos o una breve descripción del espacio para aprovechar al máximo la reunión inicial.",
      "a partir de ahí, armamos una propuesta personalizada y comenzamos el proceso de diseño.",
    ],
  },
  {
    pregunta: "¿qué debo tener en cuenta para medir mi espacio?",
    respuesta: [
      "es importante contar con medidas de ancho, largo, alto, ubicación de puertas, ventanas y demás elementos importantes que definen el espacio.",
    ],
  },
  {
    pregunta: "¿puedo solicitar una visita para la toma de medidas?",
    respuesta: [
      "sí, ofrecemos visitas presenciales para la toma de medidas. Este servicio está sujeto a disponibilidad y zonas de alcance del estudio.",
    ],
  },
  {
    pregunta: "¿cuál es el alcance de las asesorías online?",
    respuesta: [
      "incluye la definición del espacio en cuanto a distribución, criterios estéticos, materiales, mobiliario y soluciones de diseño, incluyendo el diseño de mobiliario a medida, la ubicación de elementos en el espacio y un listado de compras y elementos sugeridos.",
      "la ubicación de elementos puede contemplar luminarias, equipamiento, alturas de tomacorrientes, ubicación de artefactos y decisiones generales necesarias para comprender el diseño.",
    ],
    exclusiones: [
      "cambios estructurales como apertura de vanos, tirar paredes, etc.",
      "documentación técnica de obra ni desarrollo de instalaciones tales como electricidad, sanitarias o gas.",
    ],
    cierre:
      "por ejemplo: en el caso de una cocina, no se realizan planos técnicos como el tendido de cañerías, desagües, etc., sino la definición del diseño, la distribución y la ubicación general de los elementos que conforman la instalación dentro del espacio. En caso de requerir este tipo de documentación ejecutiva, se trata de un servicio con costo adicional ya que corresponde a un proyecto de mayor alcance.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <Navbar alwaysVisible />

      <main className="bg-background pb-16 pt-36 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/60">
                asesorías online
              </p>
              <h1 className="mt-4 text-4xl text-primary sm:text-5xl">
                preguntas frecuentes
              </h1>
            </div>

            <p className="max-w-3xl text-lg leading-relaxed text-text/75 sm:text-xl">
              algunas respuestas para elegir el servicio adecuado, preparar la
              información inicial y entender el alcance de cada asesoría.
            </p>
          </section>

          <section className="mt-14 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
            
                <p className="mt-4 text-sm leading-relaxed text-text/60">
                  si tu duda no aparece acá, podés escribirnos y vemos juntas
                  cuál es el mejor camino para tu espacio.
                </p>
              </div>

              <div className="divide-y divide-black/5">
                {preguntas.map((item, index) => (
                  <article
                    key={item.pregunta}
                    className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[52px_1fr]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-sm text-primary">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="text-base font-semibold text-primary">
                        {item.pregunta}
                      </h3>

                      <div className="mt-3 space-y-3 leading-relaxed text-text/70">
                        {item.respuesta.map((parrafo) => (
                          <p key={parrafo}>{parrafo}</p>
                        ))}

                        {item.exclusiones ? (
                          <div className="rounded-xl border border-primary/10 bg-background p-4">
                            <p className="text-sm font-semibold text-primary">
                              al tratarse de una sola instancia de corrección,
                              no incluye:
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-text/70">
                              {item.exclusiones.map((exclusion) => (
                                <li key={exclusion} className="flex gap-2">
                                  <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary/55" />
                                  <span>{exclusion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {item.cierre ? <p>{item.cierre}</p> : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-primary/10 bg-[#fffaf4] p-5 shadow-sm sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="max-w-3xl leading-relaxed text-text/75">
                si querés confirmar qué asesoría se adapta mejor a tu caso,
                escribinos y te orientamos antes de avanzar.
              </p>

              <Link
                href="/agenda"
                className="inline-flex w-fit rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:opacity-85 sm:rounded-lg sm:px-6 sm:py-3 sm:text-base"
              >
                agendar reunión
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
