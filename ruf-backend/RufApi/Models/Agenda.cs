namespace RufApi.Models;

public sealed record Reunion(
    string Id,
    string Nombre,
    string TipoProyecto,
    DateOnly Fecha,
    TimeOnly Hora,
    string Estado
);

public sealed record Bloqueo(
    string Id,
    DateOnly Fecha,
    TimeOnly Hora,
    string Motivo
);
