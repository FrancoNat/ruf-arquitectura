# documentación de rüf arquitectura

## 1. resumen general

Esta aplicación es una web institucional para `rüf arquitectura` desarrollada con `Next.js App Router`, `React`, `Tailwind CSS` y datos mock/locales.

Hoy la aplicación tiene dos grandes áreas:

- frontend público
- panel admin mock

El objetivo actual del proyecto es validar experiencia, navegación, contenido y flujos de administración sin backend real todavía.

## 2. stack técnico

- `next.js 16.2.4`
- `react 19`
- `tailwind css 4`
- `swiper` para carruseles
- `@fancyapps/ui` para lightbox en detalle de proyectos
- `next/image` para imágenes optimizadas

Scripts principales en `package.json`:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

Versión de Node esperada:

- `20.x`

Archivo relacionado:

- [.nvmrc](/Users/franco/Desktop/ruf-arquitectura/.nvmrc:1)

## 3. estructura principal

### app router

Rutas principales dentro de [src/app](/Users/franco/Desktop/ruf-arquitectura/src/app):

- `/`
- `/agenda`
- `/proyectos`
- `/proyectos/[id]`
- `/quienes-somos`
- `/admin`
- `/admin/dashboard`
- `/admin/proyectos`
- `/admin/proyectos/nuevo`
- `/admin/proyectos/[id]/editar`
- `/admin/testimonios`
- `/admin/testimonios/nuevo`
- `/admin/testimonios/[id]/editar`
- `/admin/agenda`

### componentes

Componentes públicos:

- [Navbar.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Navbar.jsx:1)
- [Hero.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Hero.jsx:1)
- [Proyectos.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Proyectos.jsx:1)
- [Testimonios.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Testimonios.jsx:1)
- [QuienesSomos.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/QuienesSomos.jsx:1)
- [Footer.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Footer.jsx:1)

Componentes admin:

- [AdminLayout.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/AdminLayout.jsx:1)
- [AdminSidebar.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/AdminSidebar.jsx:1)
- [AdminCard.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/AdminCard.jsx:1)
- [ProyectoForm.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/ProyectoForm.jsx:1)
- [ProyectoAdminCard.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/ProyectoAdminCard.jsx:1)
- [ImageManager.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/ImageManager.jsx:1)
- [TestimonioForm.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/TestimonioForm.jsx:1)
- [TestimonioAdminCard.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/TestimonioAdminCard.jsx:1)
- [StarsInput.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/StarsInput.jsx:1)
- [AdminCalendar.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/AdminCalendar.jsx:1)
- [DayDetailPanel.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/DayDetailPanel.jsx:1)
- [ReunionAdminCard.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/ReunionAdminCard.jsx:1)
- [HorarioSlotAdmin.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/HorarioSlotAdmin.jsx:1)
- [CategoriaManager.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/CategoriaManager.jsx:1)

Componentes agenda pública:

- [PublicAgendaForm.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/agenda/PublicAgendaForm.jsx:1)
- [HorariosDisponibles.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/agenda/HorariosDisponibles.jsx:1)

## 4. identidad visual

La paleta principal vive en [src/app/globals.css](/Users/franco/Desktop/ruf-arquitectura/src/app/globals.css:1).

Variables más importantes:

- `--background: #f8f4ef`
- `--foreground: #2b2b2b`
- `--primary: #4b3a33`
- `--soft: #eaeaea`

Esto asegura que:

- el fondo general del sitio y del admin sea consistente
- los botones principales usen marrón
- las cards usen blanco o beige claro

## 5. frontend público

### home

La home está compuesta por:

- `Navbar`
- `Hero`
- `Proyectos`
- `Testimonios`
- `QuienesSomos`

Archivo:

- [src/app/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/page.js:1)

### navbar

Funcionalidades actuales:

- fijo arriba
- transparente al inicio en home
- sólido al hacer scroll
- siempre visible en páginas internas usando prop `alwaysVisible`
- responsive con menú hamburguesa en mobile
- logo clickeable al home
- links funcionales a:
  - `/`
  - `/proyectos`
  - `/quienes-somos`
  - `/agenda`

### hero

Funcionalidades actuales:

- imagen full screen optimizada con `next/image`
- overlay oscuro degradado
- título principal
- descripción SEO
- CTA a `#proyectos`
- CTA a `/agenda`

### proyectos

#### home

La sección de proyectos destacados:

- usa `Swiper`
- renderiza cards con imagen, categoría y título
- cada card puede abrir su detalle
- incluye botón `ver todos los proyectos`

#### página /proyectos

La página completa de proyectos:

- muestra grilla de cards
- tiene filtros por categoría
- categorías actuales visibles:
  - `todos`
  - `casa`
  - `departamento interior`
  - `muebles`
- cada card tiene botón `ver proyecto`

#### detalle /proyectos/[id]

Cada proyecto tiene:

- título
- carrusel de imágenes
- lightbox con Fancybox
- descripción
- botón `ver todos los proyectos`
- botón `agendar reunión`

### testimonios

La sección `lo que dicen nuestros clientes`:

- usa `Swiper`
- muestra estrellas
- muestra foto de cliente
- mantiene tamaño fijo de card para uniformidad
- usa fondo general del sitio y cards marrones

### quiénes somos

Hay dos niveles:

- teaser en home
- página completa `/quienes-somos`

La página completa incluye:

- navbar visible
- fotos circulares de las arquitectas
- relato del estudio
- significado de `rüf`
- mención a atención online en argentina

### agenda pública

Archivo principal:

- [src/app/agenda/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/agenda/page.js:1)

Funcionalidad actual:

- el usuario elige fecha
- la web calcula horarios disponibles
- solo se muestran horarios libres
- el usuario elige horario
- completa nombre y tipo de proyecto
- se genera una reunión simulada en `console.log`
- luego abre WhatsApp con mensaje armado

Reglas de disponibilidad:

- una reunión `pendiente` ocupa horario
- una reunión `confirmada` ocupa horario
- una reunión `cancelada` no ocupa horario
- un bloqueo manual del admin también ocupa horario

## 6. footer

El footer se renderiza globalmente desde [src/app/layout.js](/Users/franco/Desktop/ruf-arquitectura/src/app/layout.js:1).

Incluye:

- logo
- navegación
- contacto
- ubicación
- atención online
- botón de WhatsApp
- íconos de Instagram y TikTok
- botón `acceso admin`

## 7. seo implementado

La metadata global vive en [src/app/layout.js](/Users/franco/Desktop/ruf-arquitectura/src/app/layout.js:1).

Incluye:

- `metadataBase`
- `title`
- `description`
- `keywords`
- `openGraph`
- `twitter`
- `icons`

Además:

- `html lang="es"`
- textos públicos optimizados con menciones naturales a:
  - buenos aires
  - argentina
  - atención online
  - arquitectura
  - interiorismo
  - muebles a medida

## 8. optimización de imágenes

Las imágenes importantes del frontend y del admin fueron migradas a `next/image`.

Beneficios:

- mejor performance
- menos layout shift
- optimización automática
- mejora SEO técnica

## 9. panel admin

## 9.1 login

Ruta:

- `/admin`

Funciona con login simulado del lado del cliente.

Credenciales demo actuales:

- email: `admin@ruf.com`
- contraseña: `ruf123`

No hay backend real ni sesión persistente.

## 9.2 dashboard

Ruta:

- `/admin/dashboard`

Muestra:

- resumen de proyectos
- resumen de reseñas
- resumen de reuniones
- accesos rápidos a módulos
- logo superior
- módulo para gestionar categorías

## 9.3 categorías admin

Se manejan desde:

- [src/components/admin/CategoriaManager.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/CategoriaManager.jsx:1)

Funcionalidades:

- agregar categoría
- borrar categoría
- persistir categorías en `localStorage`
- evitar borrar la última categoría disponible

Storage key usada:

- `ruf-admin-categorias`

Archivo base:

- [src/data/adminCategorias.js](/Users/franco/Desktop/ruf-arquitectura/src/data/adminCategorias.js:1)

Categorías iniciales:

- `casa`
- `interior`
- `mueble`

## 9.4 gestión de proyectos admin

Rutas:

- `/admin/proyectos`
- `/admin/proyectos/nuevo`
- `/admin/proyectos/[id]/editar`

Listado:

- cards con imagen principal
- título
- categoría
- estado
- destacado
- botón editar
- botón eliminar simulado

Formulario:

- título
- categoría
- descripción corta
- descripción larga
- ubicación
- año
- superficie
- estado
- destacado
- imagen principal
- galería de imágenes

Gestión de imágenes:

- agregar por ruta local
- eliminar
- marcar principal
- mover arriba
- mover abajo

Submit actual:

- `console.log`
- `alert("proyecto guardado")`

## 9.5 gestión de testimonios admin

Rutas:

- `/admin/testimonios`
- `/admin/testimonios/nuevo`
- `/admin/testimonios/[id]/editar`

Listado:

- foto circular
- nombre
- tipo de proyecto
- estrellas
- extracto del texto
- estado
- mostrar en home

Acciones:

- editar
- activar/desactivar
- eliminar

Formulario:

- nombre
- tipo de proyecto
- texto
- estrellas
- foto
- estado
- mostrar en home

Submit actual:

- `console.log`
- `alert("testimonio guardado")`

## 9.6 agenda admin

Ruta:

- `/admin/agenda`

Funciones:

- calendario mensual
- cambiar de mes
- seleccionar un día
- ver reuniones del día
- confirmar reunión
- cancelar reunión
- eliminar reunión
- bloquear horario
- liberar horario
- ver horarios disponibles

Toda la lógica parte de mocks compartidos.

## 10. datos mock actuales

### proyectos públicos

Archivo:

- [src/data/proyectos.js](/Users/franco/Desktop/ruf-arquitectura/src/data/proyectos.js:1)

Hoy contiene proyectos mock con:

- `id`
- `titulo`
- `categoria`
- `imagen`
- `alt`
- `descripcion`
- `imagenes`

### proyectos admin

Archivo:

- [src/data/adminProyectos.js](/Users/franco/Desktop/ruf-arquitectura/src/data/adminProyectos.js:1)

Contiene:

- `id`
- `titulo`
- `categoria`
- `descripcionCorta`
- `descripcionLarga`
- `ubicacion`
- `anio`
- `superficie`
- `estado`
- `destacado`
- `imagenPrincipal`
- `imagenes`

### testimonios admin

Archivo:

- [src/data/adminTestimonios.js](/Users/franco/Desktop/ruf-arquitectura/src/data/adminTestimonios.js:1)

### agenda compartida

Archivo:

- [src/data/agendaMock.js](/Users/franco/Desktop/ruf-arquitectura/src/data/agendaMock.js:1)

Exporta:

- `horariosBase`
- `reunionesMock`
- `bloqueosMock`
- `getHorariosDisponibles(...)`

Importante:

- este archivo lo usan tanto la agenda pública como la agenda admin

## 11. persistencia actual

Estado actual de persistencia:

- la mayor parte del admin trabaja con mocks en memoria
- las categorías sí quedan guardadas en `localStorage`
- la agenda pública no guarda reuniones reales
- la agenda admin no guarda cambios después de recargar
- proyectos y testimonios del admin no impactan automáticamente en el frontend público

## 12. assets e imágenes

Ubicaciones principales:

- logos: [public/images/logos](/Users/franco/Desktop/ruf-arquitectura/public/images/logos)
- proyectos: [public/images/proyectos](/Users/franco/Desktop/ruf-arquitectura/public/images/proyectos)
- equipo: [public/images/equipo](/Users/franco/Desktop/ruf-arquitectura/public/images/equipo)
- testimonios: [public/images/testimonios](/Users/franco/Desktop/ruf-arquitectura/public/images/testimonios)

## 13. responsive

La aplicación está ajustada para mobile y desktop:

- navbar hamburguesa en mobile
- hero con CTAs apilados en pantallas chicas
- grillas que bajan a una columna cuando corresponde
- cards con alturas controladas
- admin con sidebar adaptable

## 14. despliegue

Actualmente el proyecto ya quedó preparado para deploy portable.

Puntos clave:

- scripts estándar de Next en `package.json`
- `engines.node = 20.x`
- `npm run build` y `npm run lint` funcionando

Si se despliega en Vercel, el proyecto debe tomar el último commit de `main`.

## 15. limitaciones actuales

Hoy todavía no hay:

- autenticación real
- backend real
- base de datos
- upload real de archivos
- persistencia real de proyectos
- persistencia real de testimonios
- sincronización real entre admin y frontend

## 16. próximos pasos sugeridos

Orden recomendado para evolucionar el proyecto:

1. conectar autenticación real del admin
2. crear backend en `ASP.NET Core`
3. modelar base de datos en `PostgreSQL`
4. mover proyectos, testimonios y agenda a API real
5. integrar upload de imágenes con `Cloudinary`
6. conectar agenda pública con persistencia real y disponibilidad real
7. conectar categorías del admin a filtros públicos persistidos

## 17. credenciales y accesos de prueba

Admin demo:

- email: `admin@ruf.com`
- contraseña: `ruf123`

## 18. archivo clave para empezar a navegar el proyecto

Si alguien nuevo entra al repo, conviene mirar primero:

1. [src/app/layout.js](/Users/franco/Desktop/ruf-arquitectura/src/app/layout.js:1)
2. [src/app/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/page.js:1)
3. [src/components/Navbar.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Navbar.jsx:1)
4. [src/components/Proyectos.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/Proyectos.jsx:1)
5. [src/app/proyectos/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/proyectos/page.js:1)
6. [src/app/agenda/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/agenda/page.js:1)
7. [src/app/admin/dashboard/page.js](/Users/franco/Desktop/ruf-arquitectura/src/app/admin/dashboard/page.js:1)
8. [src/components/admin/ProyectoForm.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/ProyectoForm.jsx:1)
9. [src/components/admin/CategoriaManager.jsx](/Users/franco/Desktop/ruf-arquitectura/src/components/admin/CategoriaManager.jsx:1)
10. [src/data/agendaMock.js](/Users/franco/Desktop/ruf-arquitectura/src/data/agendaMock.js:1)
