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
    public class CompraService : ICompraService
    {
        private readonly ICompraRepository _compraRepo;

        public CompraService(ICompraRepository Repo)
        {
            _compraRepo = Repo;
        }

        public async Task<bool> Create(Compra compra)
        {
            return await _compraRepo.Create(compra);
        }

        public async Task<List<Compra>> GetAll()
        {
            return await _compraRepo.GetAll();
        }

        public async Task<List<Compra>> GetByClient(string nombreC, string apellidoC)
        {
            return await _compraRepo.GetByClient(nombreC, apellidoC);
        }

        public async Task<List<Compra>> GetByDate(DateTime fecha)
        {
            return await _compraRepo.GetByDate(fecha);
        }

        public async Task<List<Compra>> GetByFormaPago(int idForma)
        {
            return await _compraRepo.GetByFormaPago(idForma);
        }

        public async Task<Compra?> GetById(int id)
        {
            return await _compraRepo.GetById(id);
        }

        public async Task<List<Compra>> GetByTipoCompra(int idTipo)
        {
            return await _compraRepo.GetByTipoCompra(idTipo);
        }

    }
}
