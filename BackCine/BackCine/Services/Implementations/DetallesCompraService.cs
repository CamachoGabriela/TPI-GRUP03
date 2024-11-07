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
    public class DetallesCompraService : IDetallesCompraService
    {
        private readonly IDetallesCompraRepository _repository;

        public DetallesCompraService(IDetallesCompraRepository repo)
        {
            _repository = repo;
        }
        public async Task<bool> Create(DetallesCompra detallesCompra)
        {
            return await _repository.Create(detallesCompra);
        }

        public async Task<List<DetallesCompra>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<List<DetallesCompra>> GetByFunction(int idFuncion)
        {
            return await _repository.GetByFunction(idFuncion);
        }

        public async Task<DetallesCompra?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<List<DetallesCompra>> GetByIdBuy(int idCompra)
        {
            return await _repository.GetByIdBuy(idCompra);
        }

        public async Task<List<DetallesCompra>> GetByMaxPrice(decimal cant)
        {
            return await _repository.GetByMaxPrice(cant);
        }

    }
}
