using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class ButacaRepository : IButacaRepository
    {
        private readonly CineMaxContext _context;
        public ButacaRepository(CineMaxContext context)
        {
            _context = context;
        }

        public async Task<List<Butaca>> GetAllbySala(int idSala)
        {
            return await _context.Butacas.Where(b => b.IdSala == idSala).ToListAsync();
        }

        public async Task<List<Butaca>> GetAvailableByFuncion(int idFuncion) //EXISTS  Devuelve las butacas disponibles en una función
        {
            return await _context.Butacas.Where(b => !_context.ButacasReservadas.Any(br => br.IdFuncion == idFuncion && br.IdButaca == b.IdButaca) &&
                                                     !_context.DetalleButacas.Any(d => d.IdFuncion == idFuncion && d.IdButaca == b.IdButaca)).ToListAsync(); 
        }

        public async Task<Butaca?> GetById(int idButaca, int idSala, int idFuncion)
        {
            var butaca = await _context.Butacas
                .Where(b => b.IdButaca == idButaca && b.IdSala == idSala)
                .FirstOrDefaultAsync(b => _context.DetalleButacas.Any(db => db.IdButaca == idButaca && db.IdFuncion == idFuncion));

            return butaca;
        }

        public async Task<bool> IsAvailable(int idSala, int idFuncion, int idButaca)
        {
            bool isReserved = await _context.ButacasReservadas.AnyAsync(br => br.IdSala == idSala && br.IdFuncion == idFuncion && br.IdButaca == idButaca);
            bool isPurchased = await _context.DetalleButacas.AnyAsync(db => db.IdSala == idSala && db.IdFuncion == idFuncion && db.IdButaca == idButaca);

            return !isReserved && !isPurchased; 
        }

        public async Task<int> VerificarDisponibilidad(string tituloPelicula, DateTime fecha)
        {
            return await _context.VerificarDisponibilidad(tituloPelicula, fecha);
        }
    }
}
