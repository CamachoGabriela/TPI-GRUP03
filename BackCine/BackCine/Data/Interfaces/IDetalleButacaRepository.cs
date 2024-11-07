using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IDetalleButacaRepository
    {
        Task<List<DetalleButaca>> GetAllByFuncion(int idFuncion);   // Todas las butacas en una función (sin filtrar)
        Task<List<DetalleButaca>> GetBookedButacasByFuncion(int idFuncion); // Solo las reservadas/compradas
        Task<bool> AddDetalleButaca(DetalleButaca detalleButaca);   // Para reservar una butaca
        Task<bool> LiberarButaca(int idButaca, int idFuncion);   // Para liberar una butaca
    }
}
