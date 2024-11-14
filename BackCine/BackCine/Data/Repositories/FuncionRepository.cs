using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class FuncionRepository : IFuncionRepository
    {
        private CineMaxContext _context;
        public FuncionRepository(CineMaxContext context)
        {
            _context = context;
        }
        public async Task<bool> Create(Funcione funcion)
        {
            _context.Funciones.Add(funcion);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Funcione>> GetAll()
        {
            return await _context.Funciones.ToListAsync();
        }

        public async Task<List<Funcione>> GetByDate(DateTime fecha)
        {
            return await _context.Funciones.Where(x => x.FechaFuncion.Date == fecha.Date).ToListAsync();
        }

        public async Task<List<Funcione>> GetByFilm(int idPeli)
        {
            return await _context.Funciones.Where(x => x.IdPelicula == idPeli).ToListAsync();
        }

        public async Task<Funcione?> GetById(int id)
        {
            return await _context.Funciones.FindAsync(id);
        }

        public async Task<bool> Update(int id, Funcione funcion)
        {
            var funcionExistente = await _context.Funciones.FindAsync(id);

            if (funcionExistente == null) return false;

            funcionExistente.FechaFuncion = funcion.FechaFuncion;
            funcionExistente.HsInicio = funcion.HsInicio;       //HH:MM:SS
            funcionExistente.PrecioBase = funcion.PrecioBase;

            _context.Update(funcionExistente);

            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<List<FuncionWithNavigation>> GetFuncionesSalasPeliculas()
        {
            var funciones = await _context.Funciones.ToListAsync();
            var peliculas = await _context.Peliculas.ToListAsync();
            var salas = await _context.Salas.ToListAsync();
            var result = (from f in funciones
                          join p in peliculas on f.IdPelicula equals p.IdPelicula into pGroup
                          from p in pGroup.DefaultIfEmpty()
                          join s in salas on f.IdSala equals s.IdSala into sGroup
                          from s in sGroup.DefaultIfEmpty()
                          select new FuncionWithNavigation
                          {
                              IdFuncion = f.IdFuncion,
                              IdPelicula = f.IdPelicula,
                              IdSala = f.IdSala,
                              FechaFuncion = f.FechaFuncion,
                              HsInicio = f.HsInicio,
                              PrecioBase = f.PrecioBase,
                              IdPromocion = f.IdPromocion,
                              Descripcion = f.FechaFuncion.ToShortDateString() + " - " + f.HsInicio.ToString(),
                              PeliculaDescripcion = p.Titulo,
                              SalaDescripcion = s.Descripcion
                          }).ToList();
            return result;
        }
    }
}
