using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IButacaService
    {
        Task<List<Butaca>> ButacasPorSala(int idSala);
        Task<Butaca?> ButacasById(int idButaca, int idSala, int idFuncion);
        Task<List<Butaca>> ButacasDisponiblesPorFuncion(int idFuncion);
        Task<bool> VerDisponibilidad(int idSala, int idFuncion, int idButaca);
        Task<int> VerificarDisponibilidad(string tituloPelicula, DateTime fecha);
    }
}
