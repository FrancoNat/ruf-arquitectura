namespace RufApi.Models;

public sealed class Testimonio
{
    public Testimonio()
    {
    }

    public Testimonio(
        string id,
        string nombre,
        string tipoProyecto,
        string texto,
        int estrellas,
        string foto,
        string estado,
        bool mostrarEnHome)
    {
        Id = id;
        Nombre = nombre;
        TipoProyecto = tipoProyecto;
        Texto = texto;
        Estrellas = estrellas;
        Foto = foto;
        Estado = estado;
        MostrarEnHome = mostrarEnHome;
    }

    public string Id { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string TipoProyecto { get; set; } = string.Empty;
    public string Texto { get; set; } = string.Empty;
    public int Estrellas { get; set; } = 5;
    public string Foto { get; set; } = string.Empty;
    public string Estado { get; set; } = "activo";
    public bool MostrarEnHome { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
