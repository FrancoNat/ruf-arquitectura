namespace RufApi.Models;

public sealed class Categoria
{
    public Categoria()
    {
    }

    public Categoria(string id, string nombre)
    {
        Id = id;
        Nombre = nombre;
    }

    public string Id { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
