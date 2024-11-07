using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IPeliculaService
    {
        Task<List<Pelicula>> GetFilms();
        Task<Pelicula?> GetFilmById(int id);
        Task<Pelicula?> GetFilmByTitle(string titulo);
        Task<List<Pelicula>> GetFilmByGenre(string genero);
        Task<bool> CrearPelicula(Pelicula pelicula);
        Task<bool> EditarPelicula(int id, Pelicula pelicula);
        Task<bool> EliminarPelicula(int id);
    }
}
