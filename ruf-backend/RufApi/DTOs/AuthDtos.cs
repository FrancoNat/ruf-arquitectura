namespace RufApi.DTOs;

public sealed record LoginRequest(string Email, string Password);

public sealed record UsuarioRequest(
    string Nombre,
    string Email,
    string? Password,
    string Rol,
    bool Activo);
