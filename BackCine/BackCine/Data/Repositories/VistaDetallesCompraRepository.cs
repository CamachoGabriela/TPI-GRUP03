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
    public class VistaDetallesCompraRepository : IVistaDetallesCompraRepository
    {
        private readonly CineMaxContext _context;
        public VistaDetallesCompraRepository(CineMaxContext context)
        {
            _context = context;
        }
        public async Task<List<VisDetallesCompra>> GetDetallesComprasByDateRange(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _context.VisDetallesCompras
            .FromSqlRaw("SELECT * FROM Vis_DetallesCompras WHERE FechaCompra BETWEEN {0} AND {1}", fechaInicio, fechaFin)
            .ToListAsync();
        }
    }
}
