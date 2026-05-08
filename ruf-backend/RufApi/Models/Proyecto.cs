using System.Text.Json.Serialization;

namespace RufApi.Models;

public sealed class Proyecto
{
    public Proyecto()
    {
    }

    public Proyecto(
        string id,
        string titulo,
        string categoria,
        string descripcionCorta,
        string descripcionLarga,
        string ubicacion,
        string anio,
        string superficie,
        string estado,
        bool destacado,
        string imagenPrincipal,
        List<string> imagenes)
    {
        Id = id;
        Titulo = titulo;
        Slug = id;
        Categoria = categoria;
        DescripcionCorta = descripcionCorta;
        DescripcionLarga = descripcionLarga;
        Ubicacion = ubicacion;
        Anio = anio;
        Superficie = superficie;
        Estado = estado;
        Destacado = destacado;
        ImagenPrincipal = imagenPrincipal;
        Alt = $"{titulo} desarrollado por rüf arquitectura";
        Imagenes = imagenes;
    }

    public string Id { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string DescripcionCorta { get; set; } = string.Empty;
    public string DescripcionLarga { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string Anio { get; set; } = string.Empty;
    public string Superficie { get; set; } = string.Empty;
    public string Estado { get; set; } = "publicado";
    public bool Destacado { get; set; }
    public string ImagenPrincipal { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
    public List<string> Imagenes { get; set; } = [];
    [JsonIgnore]
    public List<ProyectoImagen> ImagenesPersistidas { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public sealed class ProyectoImagen
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Url { get; set; } = string.Empty;
    public string Alt { get; set; } = string.Empty;
    public int Orden { get; set; }
    public string ProyectoId { get; set; } = string.Empty;
    public Proyecto Proyecto { get; set; } = null!;
}
