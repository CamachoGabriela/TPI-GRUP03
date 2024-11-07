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
    public class VistaDetallesCompraService : IVistaDetallesCompraService
    {
        private readonly IVistaDetallesCompraRepository _repository;
        public VistaDetallesCompraService(IVistaDetallesCompraRepository repository)
        {
            _repository = repository;
        }
        public async Task<List<VisDetallesCompra>> GetDetallesComprasByDateRange(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _repository.GetDetallesComprasByDateRange(fechaInicio, fechaFin);
        }
    }
}
