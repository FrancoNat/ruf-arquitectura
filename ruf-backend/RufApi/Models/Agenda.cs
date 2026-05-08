namespace RufApi.Models;

public sealed class HorarioBase
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public TimeOnly Hora { get; set; }
    public bool Activo { get; set; } = true;
    public int Orden { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public sealed class Reunion
{
    public Reunion()
    {
    }

    public Reunion(
        string id,
        string nombre,
        string tipoProyecto,
        DateOnly fecha,
        TimeOnly hora,
        string estado)
    {
        Id = id;
        Nombre = nombre;
        TipoProyecto = tipoProyecto;
        Fecha = fecha;
        Hora = hora;
        Estado = estado;
    }

    public string Id { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string TipoProyecto { get; set; } = string.Empty;
    public DateOnly Fecha { get; set; }
    public TimeOnly Hora { get; set; }
    public string Estado { get; set; } = "pendiente";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public sealed class Bloqueo
{
    public Bloqueo()
    {
    }

    public Bloqueo(
        string id,
        DateOnly fecha,
        TimeOnly hora,
        string motivo)
    {
        Id = id;
        Fecha = fecha;
        Hora = hora;
        Motivo = motivo;
    }

    public string Id { get; set; } = string.Empty;
    public DateOnly Fecha { get; set; }
    public TimeOnly Hora { get; set; }
    public string Motivo { get; set; } = string.Empty;
}

public sealed class BloqueoHorario
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public DateOnly Fecha { get; set; }
    public TimeOnly Hora { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
