namespace RufApi.Models;

public sealed record Proyecto(
    string Id,
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
    List<string> Imagenes
);
