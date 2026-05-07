namespace RufApi.DTOs;

public sealed record TestimonioRequest(
    string Nombre,
    string TipoProyecto,
    string Texto,
    int Estrellas,
    string Foto,
    string Estado,
    bool MostrarEnHome
);
