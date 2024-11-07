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
    public class PeliculaRepository : IPeliculaRepository
    {
        private CineMaxContext _context;
        public PeliculaRepository(CineMaxContext context)
        {
            _context = context;
        }
        public async Task<bool> CreateFilm(Pelicula pelicula)
        {
            _context.Peliculas.Add(pelicula);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteFilm(int id)
        {
            var peliEliminada = await _context.Peliculas.FindAsync(id);
            if (peliEliminada != null)
            {
                peliEliminada.EstaActivo = false;
                _context.Peliculas.Update(peliEliminada);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<List<Pelicula>> GetAll()
        {
            return await _context.Peliculas.Where(x => x.EstaActivo == true).ToListAsync();
        }

        public async Task<List<Pelicula>> GetByGenre(string genero)
        {
            var buscarGenero = await _context.Generos.FirstOrDefaultAsync(g => g.Genero1 == genero);
            if(buscarGenero == null)
            {
                return new List<Pelicula>(); //Devuelve una lista de películas vacía
            }
            return await _context.Peliculas.Where(p => p.IdGeneros.Any(g => g.IdGenero == buscarGenero.IdGenero)).ToListAsync();
        }

        public async Task<Pelicula?> GetById(int id)
        {
            return await _context.Peliculas.FindAsync(id);
        }

        public async Task<Pelicula?> GetByTitle(string titulo)
        {
            return await _context.Peliculas.FirstOrDefaultAsync(p => p.Titulo.Equals(titulo));
        }

        public async Task<bool> UpdateFilm(int id, Pelicula pelicula)
        {
            var peliExistente = await _context.Peliculas.FindAsync(id);
            if(peliExistente == null) { return false; }

            peliExistente.Titulo = pelicula.Titulo;
            peliExistente.Duracion = pelicula.Duracion;

            _context.Update(peliExistente);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
