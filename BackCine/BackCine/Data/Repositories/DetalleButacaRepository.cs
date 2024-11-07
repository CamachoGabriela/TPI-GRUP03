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
    public class DetalleButacaRepository : IDetalleButacaRepository
    {
        private readonly CineMaxContext _context;
        public DetalleButacaRepository(CineMaxContext context)
        {
            _context = context;
        }
        public async Task<bool> AddDetalleButaca(DetalleButaca detalleButaca)
        {
            _context.DetalleButacas.Add(detalleButaca);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<DetalleButaca>> GetAllByFuncion(int idFuncion)
        {
            return await _context.DetalleButacas.Where(db => db.IdFuncion == idFuncion).ToListAsync();
        }

        public async Task<List<DetalleButaca>> GetBookedButacasByFuncion(int idFuncion)
        {
            return await _context.DetalleButacas.Where(db => _context.ButacasReservadas.Any(br => br.IdFuncion == idFuncion && br.IdButaca == db.IdButaca) &&
                                                             _context.DetalleButacas.Any(d => d.IdFuncion == idFuncion && d.IdButaca == db.IdButaca)).ToListAsync();
        }

        public async Task<bool> LiberarButaca(int idButaca, int idFuncion)
        {
            var detalleButaca = await _context.DetalleButacas.FirstOrDefaultAsync(db => db.IdButaca == idButaca && db.IdFuncion == idFuncion);

            if(detalleButaca != null)
            {
                _context.DetalleButacas.Remove(detalleButaca);
            }

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
