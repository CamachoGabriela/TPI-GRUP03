using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IReservaService
    {
        Task<List<Reserva>> GetReservas(); 
        Task<Reserva?> GetReservaById(int id); 
        Task<List<Reserva>> GetReservaByCliente(int id); 
        Task<bool> Reservar(Reserva reserva, List<int> butacasIds);
        Task<bool> ActualizarEstado(int id, int nuevoEstado);
        Task<bool> ActualizarButacas(int id, List<int> nuevasButacasIds);
        Task<bool> VerDisponibilidad(int idFuncion, int idButaca, int idSala);
        Task<bool> CancelarReserva(int id);
    }
}
