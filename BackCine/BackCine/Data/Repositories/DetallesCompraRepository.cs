using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class DetallesCompraRepository : IDetallesCompraRepository
    {
        private CineMaxContext _context;

        public DetallesCompraRepository(CineMaxContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(DetallesCompra detallesCompra)
        {
            await _context.DetallesCompras.AddAsync(detallesCompra);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<DetallesCompra>> GetAll()
        {
            return await _context.DetallesCompras.ToListAsync();
        }

        public async Task<List<DetallesCompra>> GetByFunction(int idFuncion)
        {
            return await _context.DetallesCompras.Where(x => x.IdFuncion == idFuncion).ToListAsync();
        }

        public async Task<DetallesCompra?> GetById(int id)
        {
            return await _context.DetallesCompras.FindAsync(id);
        }

        public async Task<List<DetallesCompra>> GetByIdBuy(int idCompra)
        {
            return await _context.DetallesCompras.Where(x => x.IdCompra == idCompra).ToListAsync();
        }

        public async Task<List<DetallesCompra>> GetByMaxPrice(decimal cant)
        {
            return await _context.DetallesCompras.Where(x => x.PrecioEntrada < cant).ToListAsync();
        }

    }
}
