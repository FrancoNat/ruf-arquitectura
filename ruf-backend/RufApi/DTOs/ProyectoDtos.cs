namespace RufApi.DTOs;

public sealed record ProyectoRequest(
    string Titulo,
    string Categoria,
    string DescripcionCorta,
    string DescripcionLarga,
    string Ubicacion,
    string Anio,
    string Superficie,
    string Estado,
    bool Destacado,
    string ImagenPrincipal,
    List<string> Imagenes,
    string? Slug = null,
    string? Alt = null,
    List<ProyectoIncluyeItemRequest>? Incluye = null
);

public sealed record ProyectoIncluyeItemRequest(
    string Titulo,
    string Descripcion,
    List<string>? Items = null
);
