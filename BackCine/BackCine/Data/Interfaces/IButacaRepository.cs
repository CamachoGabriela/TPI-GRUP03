using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IButacaRepository
    {
        Task<List<Butaca>> GetAllbySala(int idSala);
        Task<Butaca?> GetById(int idButaca, int idSala, int idFuncion);
        Task<List<Butaca>> GetAvailableByFuncion(int idFuncion); //Devuelve butacas disponibles por función
        Task<int> VerificarDisponibilidad(string tituloPelicula, DateTime fecha); //Devuelve cantidad de butacas disponibles en un día y película específico
        Task<bool> IsAvailable(int idSala, int idFuncion, int idButaca); //Verifica si una butaca está libre u ocupada

    }
}
