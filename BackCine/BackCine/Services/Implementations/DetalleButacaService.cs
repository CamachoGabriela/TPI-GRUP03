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
    public class DetalleButacaService : IDetalleButacaService
    {
        private readonly IDetalleButacaRepository _repository;
        public DetalleButacaService(IDetalleButacaRepository repository)
        {
            _repository = repository;            
        }

        public async Task<List<DetalleButaca>> GetButacasOcupadasPorFuncion(int idFuncion)
        {
            return await _repository.GetBookedButacasByFuncion(idFuncion);
        }

        public async Task<List<DetalleButaca>> GetPorFuncion(int idFuncion)
        {
            return await _repository.GetAllByFuncion(idFuncion);
        }

        public async Task<bool> LiberarButaca(int idButaca, int idFuncion)
        {
            return await _repository.LiberarButaca(idButaca, idFuncion);
        }

        public async Task<bool> RegistrarDetalleButaca(DetalleButaca detalleButaca)
        {
            return await _repository.AddDetalleButaca(detalleButaca);
        }
    }
}
