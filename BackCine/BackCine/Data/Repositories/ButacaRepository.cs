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

        public async Task<List<ButacaConEstado>> GetAllbySalaFuncion(int idSala, int idFuncion)
        {
            var butacas = await _context.Butacas.Where(b => b.IdSala == idSala).ToListAsync(); 
            var detalleButacas = await _context.DetalleButacas.Where(db => db.IdFuncion == idFuncion).Select(db => db.IdButaca).ToListAsync(); 
            var butacasReservadas = await _context.ButacasReservadas.Where(br => br.IdFuncion == idFuncion).ToListAsync(); 
            var reservas = await _context.Reservas.ToListAsync(); var result = (from b in butacas
                                                                                join br in butacasReservadas on b.IdButaca equals br?.IdButaca into brGroup
                                                                                from br in brGroup.DefaultIfEmpty()
                                                                                join r in reservas on br?.IdReserva equals r?.IdReserva into rGroup
                                                                                from r in rGroup.DefaultIfEmpty()
                                                                                select new ButacaConEstado
                                                                                {
                                                                                    IdButaca = b.IdButaca,
                                                                                    NroButaca = b.NroButaca,
                                                                                    Estado = (r != null) ? r.IdEstado : 0
                                                                                }).ToList();

            return result;

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
        public async Task<List<Sala>> GetSalas()
        {
            return await _context.Salas.ToListAsync();
        }
    }
}
