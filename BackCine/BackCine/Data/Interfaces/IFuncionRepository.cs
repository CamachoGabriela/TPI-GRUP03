using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IFuncionRepository
    {
        Task<List<Funcione>> GetAll();
        Task<Funcione?> GetById(int id);
        Task<List<Funcione>> GetByDate(DateTime fecha);
        Task<List<Funcione>> GetByFilm(int idPeli);
        Task<bool> Create(Funcione funcion);
        Task<bool> Update(int id, Funcione funcion);
    }
}
