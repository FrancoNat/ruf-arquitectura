using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RufApi.Data;

public sealed class RufDbContextFactory : IDesignTimeDbContextFactory<RufDbContext>
{
    public RufDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<RufDbContext>();
        var connectionString =
            Environment.GetEnvironmentVariable("RUF_DB_CONNECTION") ??
            "Host=localhost;Port=5432;Database=ruf_db;Username=postgres";

        optionsBuilder.UseNpgsql(connectionString);

        return new RufDbContext(optionsBuilder.Options);
    }
}
