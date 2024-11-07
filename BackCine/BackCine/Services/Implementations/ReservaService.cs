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
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _repository;
        public ReservaService(IReservaRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> ActualizarButacas(int id, List<int> nuevasButacasIds)
        {
            return await _repository.UpdateButacas(id, nuevasButacasIds);
        }

        public async Task<bool> ActualizarEstado(int id, int nuevoEstado)
        {
            if (nuevoEstado != 1 && nuevoEstado != 2)
            {
                throw new ArgumentException("El estado solo puede ser actualizado a Pendiente o Confirmado.");
            } 
            return await _repository.UpdateStatus(id,nuevoEstado);
        }

        public async Task<bool> CancelarReserva(int id)
        {
            return await _repository.Cancel(id);
        }

        public async Task<List<Reserva>> GetReservaByCliente(int id)
        {
            return await _repository.GetByCliente(id);
        }

        public async Task<Reserva?> GetReservaById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<List<Reserva>> GetReservas()
        {
            return await _repository.GetAll();
        }

        public async Task<bool> Reservar(Reserva reserva, List<int> butacasIds)
        {
            return await _repository.CreateReserve(reserva, butacasIds);
        }

        public async Task<bool> VerDisponibilidad(int idFuncion, int idButaca, int idSala)
        {
            return await _repository.CheckAvailability(idFuncion, idButaca, idSala);
        }
    }
}
