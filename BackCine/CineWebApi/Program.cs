using BackCine.Data;
using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using BackCine.Data.Repositories;
using BackCine.Services.Implementations;
using BackCine.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddDbContext<CineMaxContext>(
        options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();

builder.Services.AddScoped<IFuncionRepository, FuncionRepository>();
builder.Services.AddScoped<IFuncionService, FuncionService>();

builder.Services.AddScoped<IPeliculaRepository, PeliculaRepository>();
builder.Services.AddScoped<IPeliculaService, PeliculaService>();

builder.Services.AddScoped<IButacaRepository, ButacaRepository>();
builder.Services.AddScoped<IButacaService, ButacaService>();

builder.Services.AddScoped<IDetalleButacaRepository, DetalleButacaRepository>();
builder.Services.AddScoped<IDetalleButacaService, DetalleButacaService>();

builder.Services.AddScoped<ICompraRepository, CompraRepository>();
builder.Services.AddScoped<ICompraService, CompraService>();

builder.Services.AddScoped<IDetallesCompraRepository, DetallesCompraRepository>();
builder.Services.AddScoped<IDetallesCompraService, DetallesCompraService>();

builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IReservaService, ReservaService>();

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

builder.Services.AddScoped<IAnalisisOcupacionService, AnalisisOcupacionService>();
builder.Services.AddScoped<IVistaDetallesCompraRepository, VistaDetallesCompraRepository>();
builder.Services.AddScoped<IVistaDetallesCompraService, VistaDetallesCompraService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CORS");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
