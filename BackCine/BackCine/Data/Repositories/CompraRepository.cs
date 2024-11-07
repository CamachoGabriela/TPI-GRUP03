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
    public class CompraRepository : ICompraRepository
    {
        private CineMaxContext _context;

        public CompraRepository(CineMaxContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(Compra compra)
        {
            await _context.Compras.AddAsync(compra);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Compra>> GetAll()
        {
            return await _context.Compras.ToListAsync();
        }

        public async Task<List<Compra>> GetByClient(string nombreC, string apellidoC)
        {
            return await _context
                        .Compras
                        .Where(x => x.IdClienteNavigation.Nombre.Equals(nombreC) && x.IdClienteNavigation.Apellido.Equals(apellidoC))
                        .ToListAsync();
        }

        public async Task<List<Compra>> GetByDate(DateTime fecha)
        {
            return await _context.Compras.Where(x => x.FechaCompra.Date == fecha.Date).ToListAsync();
        }

        public async Task<Compra?> GetById(int id)
        {
            return await _context.Compras.Where(x => x.IdCompra == id).FirstOrDefaultAsync();
        }

        public async Task<List<Compra>> GetByFormaPago(int idForma)
        {
            return await _context.Compras.Where(x => x.IdFormaPago == idForma).ToListAsync();
        }

        public async Task<List<Compra>> GetByTipoCompra(int idTipo)
        {
            return await _context.Compras.Where(x => x.IdTipoCompra == idTipo).ToListAsync();
        }

    }
}
