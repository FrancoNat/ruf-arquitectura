namespace RufApi.DTOs;

public sealed record ReunionRequest(
    string Nombre,
    string TipoProyecto,
    DateOnly Fecha,
    TimeOnly Hora
);

public sealed record EstadoReunionRequest(string Estado);

public sealed record BloqueoRequest(
    DateOnly Fecha,
    TimeOnly Hora,
    string Motivo
);
