using BackCine.Data;
using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IFuncionService
    {
        Task<List<Funcione>> GetFunciones();
        Task<Funcione?> GetFuncionById(int id);
        Task<List<Funcione>> GetFuncionByDate(DateTime fecha);
        Task<List<Funcione>> GetFuncionByFilm(int idPeli);
        Task<bool> RegistrarFuncion (Funcione funcion);
        Task<bool> EditarFuncion(int id, Funcione funcion);
    }
}
