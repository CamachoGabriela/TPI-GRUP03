using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using BackCine.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Implementations
{
    public class PeliculaService : IPeliculaService
    {
        private readonly IPeliculaRepository _repository;
        public PeliculaService(IPeliculaRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> CrearPelicula(Pelicula pelicula)
        {
            return await _repository.CreateFilm(pelicula);
        }

        public async Task<bool> EditarPelicula(int id, Pelicula pelicula)
        {
            return await _repository.UpdateFilm(id, pelicula);
        }

        public async Task<bool> EliminarPelicula(int id)
        {
            return await _repository.DeleteFilm(id);
        }

        public async Task<List<Pelicula>> GetFilmByGenre(string genero)
        {
            return await _repository.GetByGenre(genero);
        }

        public async Task<Pelicula?> GetFilmById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Pelicula?> GetFilmByTitle(string titulo)
        {
            return await _repository.GetByTitle(titulo);
        }

        public async Task<List<Pelicula>> GetFilms()
        {
            return await _repository.GetAll();
        }
    }
}
