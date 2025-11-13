using Microsoft.EntityFrameworkCore;
using MovieManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");

Console.WriteLine($"Original connection string: {connectionString}");

if (!string.IsNullOrEmpty(connectionString))
{
    // Handle postgresql:// connection string format
    if (connectionString.StartsWith("postgresql://") || connectionString.StartsWith("postgres://"))
    {
        connectionString = connectionString.Replace("postgresql://", "").Replace("postgres://", "");
        
        // Find the last @ which separates user:password from host
        var lastAtIndex = connectionString.LastIndexOf('@');
        if (lastAtIndex > 0)
        {
            var userInfo = connectionString.Substring(0, lastAtIndex);
            var hostInfo = connectionString.Substring(lastAtIndex + 1);
            
            var userParts = userInfo.Split(':');
            var username = userParts[0];
            var password = userParts.Length > 1 ? string.Join(":", userParts.Skip(1)) : "";
            
            var hostParts = hostInfo.Split('/');
            var hostAndPort = hostParts[0].Split(':');
            var host = hostAndPort[0];
            var port = hostAndPort.Length > 1 ? hostAndPort[1] : "5432";
            var database = hostParts.Length > 1 ? hostParts[1].Split('?')[0] : "postgres";
            
            connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            Console.WriteLine($"Parsed connection string: Host={host};Port={port};Database={database};Username={username};SSL Mode=Require");
        }
    }
    else
    {
        Console.WriteLine("Using connection string as-is (not postgresql:// format)");
    }
}
else
{
    throw new InvalidOperationException("Database connection string is not configured.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Starting database migration...");
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Check if database can be connected
        var canConnect = await context.Database.CanConnectAsync();
        logger.LogInformation($"Database connection test: {canConnect}");
        
        if (canConnect)
        {
            logger.LogInformation("Running migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migration completed successfully!");
        }
        else
        {
            logger.LogError("Cannot connect to database!");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database. Error: {Message}", ex.Message);
        logger.LogError("Inner exception: {InnerException}", ex.InnerException?.Message);
        // Don't throw - let the app start so we can see logs
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
