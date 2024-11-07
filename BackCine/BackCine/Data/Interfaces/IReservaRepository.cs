using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IReservaRepository
    {
        Task<List<Reserva>> GetAll();
        Task<Reserva?> GetById(int id);
        Task<List<Reserva>> GetByCliente(int id);
        Task<bool> CreateReserve(Reserva reserva, List<int> butacasIds);
        Task<bool> UpdateStatus(int id, int nuevoEstado);
        Task<bool> UpdateButacas(int idReserva, List<int> nuevasButacasIds);
        Task<bool> CheckAvailability(int idFuncion, int idButaca, int idSala);
        Task<bool> Cancel(int id);
    }
}
