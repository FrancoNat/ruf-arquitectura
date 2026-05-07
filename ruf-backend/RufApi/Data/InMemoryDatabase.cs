using System.Text;
using RufApi.Models;

namespace RufApi.Data;

public sealed class InMemoryDatabase
{
    public List<Categoria> Categorias { get; } =
    [
        new("casa", "casa"),
        new("interior", "interior"),
        new("mueble", "mueble")
    ];

    public List<Proyecto> Proyectos { get; } =
    [
        new(
            "casa-moderna",
            "casa moderna",
            "casa",
            "vivienda moderna con espacios amplios.",
            "proyecto residencial pensado para potenciar la luz natural, la amplitud visual y una atmosfera serena en cada ambiente.",
            "buenos aires, argentina",
            "2026",
            "180 m²",
            "publicado",
            true,
            "/images/proyectos/casa interior moderno elegante.jpeg",
            [
                "/images/proyectos/casa interior moderno elegante.jpeg",
                "/images/proyectos/departamento.jpg",
                "/images/proyectos/vestidor 1.jpg"
            ]
        ),
        new(
            "departamento-centro",
            "departamento centro",
            "interior",
            "interiorismo de departamento con diseño contemporáneo.",
            "renovación interior con foco en circulación, guardado y una estética contemporánea de líneas limpias.",
            "buenos aires, argentina",
            "2025",
            "95 m²",
            "publicado",
            false,
            "/images/proyectos/departamento.jpg",
            [
                "/images/proyectos/departamento.jpg",
                "/images/proyectos/casa interior moderno elegante.jpeg"
            ]
        ),
        new(
            "vestidor-bespoke",
            "vestidor bespoke",
            "mueble",
            "diseño de mobiliario a medida con terminaciones premium.",
            "desarrollo de vestidor personalizado con módulos flexibles, iluminación puntual y guardado eficiente.",
            "buenos aires, argentina",
            "2024",
            "24 m²",
            "borrador",
            true,
            "/images/proyectos/vestidor 1.jpg",
            [
                "/images/proyectos/vestidor 1.jpg",
                "/images/proyectos/vestidor 2.jpg",
                "/images/proyectos/vestidor 3.jpg"
            ]
        )
    ];

    public List<Testimonio> Testimonios { get; } =
    [
        new("maria-g", "maría g.", "vivienda", "nos acompañaron en todo el proceso, desde la idea hasta la ejecución. super profesionales.", 5, "/images/clientes/cliente1.jpg", "activo", true),
        new("juan-p", "juan p.", "interiorismo", "lograron exactamente lo que queríamos. el diseño y los detalles fueron impecables.", 5, "/images/clientes/cliente2.jpg", "activo", true),
        new("lucas-r", "lucas r.", "muebles a medida", "cumplieron tiempos y presupuesto. volveríamos a elegirlas sin dudar.", 5, "/images/clientes/cliente3.jpg", "inactivo", false)
    ];

    public List<TimeOnly> HorariosBase { get; } =
    [
        new(10, 0),
        new(11, 0),
        new(12, 0),
        new(16, 0),
        new(17, 0),
        new(18, 0)
    ];

    public List<Reunion> Reuniones { get; } =
    [
        new("1", "maría g.", "interiorismo", new DateOnly(2026, 5, 10), new TimeOnly(10, 0), "pendiente"),
        new("2", "lucas r.", "vivienda", new DateOnly(2026, 5, 10), new TimeOnly(16, 0), "confirmada"),
        new("3", "juan p.", "muebles a medida", new DateOnly(2026, 5, 12), new TimeOnly(17, 0), "pendiente")
    ];

    public List<Bloqueo> Bloqueos { get; } =
    [
        new("b1", new DateOnly(2026, 5, 10), new TimeOnly(11, 0), "ocupado por obra"),
        new("b2", new DateOnly(2026, 5, 12), new TimeOnly(12, 0), "visita tecnica")
    ];

    public static string Slugify(string value)
    {
        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();
        var previousWasDash = false;

        foreach (var character in normalized)
        {
            var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(character);

            if (category == System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                continue;
            }

            if (char.IsLetterOrDigit(character))
            {
                builder.Append(character);
                previousWasDash = false;
                continue;
            }

            if (!previousWasDash)
            {
                builder.Append('-');
                previousWasDash = true;
            }
        }

        return builder.ToString().Trim('-');
    }

    public static string EnsureUniqueId(string baseId, IEnumerable<string> existingIds)
    {
        var id = string.IsNullOrWhiteSpace(baseId) ? Guid.NewGuid().ToString("N")[..8] : baseId;
        var existing = existingIds.ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (!existing.Contains(id))
        {
            return id;
        }

        var suffix = 2;
        while (existing.Contains($"{id}-{suffix}"))
        {
            suffix++;
        }

        return $"{id}-{suffix}";
    }
}
