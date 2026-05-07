namespace RufApi.Models;

public sealed record Testimonio(
    string Id,
    string Nombre,
    string TipoProyecto,
    string Texto,
    int Estrellas,
    string Foto,
    string Estado,
    bool MostrarEnHome
);
