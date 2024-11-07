using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly CineMaxContext _context;
        public ReservaRepository(CineMaxContext context)
        {
            _context = context;
        }

        public async Task<bool> Cancel(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return false;

            reserva.IdEstado = 3;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CheckAvailability(int idFuncion, int idButaca, int idSala)
        {
            var isReserved = await _context.ButacasReservadas
                                       .AnyAsync(br => br.IdFuncion == idFuncion && br.IdButaca == idButaca && br.IdSala == idSala);
            var isPurchased = await _context.DetallesCompras
                                       .AnyAsync(dc => dc.IdFuncion == idFuncion && dc.IdButaca == idButaca );
            return !(isReserved || isPurchased);
        }

        public async Task<bool> CreateReserve(Reserva reserva, List<int> butacasIds)
        {
            try
            {
                var funcion = await _context.Funciones
                                   .Where(f => f.IdFuncion == reserva.IdFuncion)
                                   .Select(f => new { f.IdSala })
                                   .FirstOrDefaultAsync();
                int idSala = funcion.IdSala;

                if (!await _context.Funciones.AnyAsync(f => f.IdFuncion == reserva.IdFuncion))
                {
                    throw new Exception("La función especificada no existe.");
                }
                //Verificar la disponibilidad de cada butaca
                foreach (var idButaca in butacasIds)
                {
                    var disponible = await CheckAvailability(reserva.IdFuncion, idButaca, idSala);
                    if (!disponible)
                    {
                        throw new Exception($"La butaca con ID {idButaca} en la función {reserva.IdFuncion} no está disponible.");
                    }
                
                    if (!await _context.Butacas.AnyAsync(b => b.IdButaca == idButaca && b.IdSala == idSala))
                    {
                        throw new Exception($"La butaca con ID {idButaca} en la sala {idSala} no existe.");
                    }
                }

                Console.WriteLine($"Reserva details: {JsonConvert.SerializeObject(reserva, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })}");
                
                // Save the Reserva first to generate the ID
                _context.Reservas.Add(reserva);
                var result = await _context.SaveChangesAsync() > 0;

                // Log the result of the save operation
                Console.WriteLine($"Reserva, resultado guardado: {result}");


                if (result)
                {
                    // Asociar las butacas reservadas a la reserva
                    foreach (var idButaca in butacasIds)
                    {
                        var butacaReservada = new ButacasReservada
                        {
                            IdReserva = reserva.IdReserva,
                            IdButaca = idButaca,
                            IdFuncion = reserva.IdFuncion,
                            IdSala = idSala
                        };
                        _context.ButacasReservadas.Add(butacaReservada);
                    }
                    Console.WriteLine($"Asociando Butacas Reservadas a Reserva: {reserva.IdReserva}");
                    bool butacasGuardadas = await _context.SaveChangesAsync() > 0;
                    if (butacasGuardadas)
                    {
                        Console.WriteLine($"Reserva {reserva.IdReserva} registrada exitosamente con butacas.");
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }

        public async Task<List<Reserva>> GetAll()
        {
            return await _context.Reservas.Where(x=>x.IdEstado==3).ToListAsync();
        }

        public async Task<List<Reserva>> GetByCliente(int id)
        {
            return await _context.Reservas.Where(r => r.IdCliente == id).ToListAsync();
        }

        public async Task<Reserva?> GetById(int id)
        {
            return await _context.Reservas.FindAsync(id);
        }

        public async Task<bool> UpdateButacas(int idReserva, List<int> nuevasButacasIds)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Buscar la reserva y su función asociada
                var reserva = await _context.Reservas
                    .Include(r => r.IdFuncionNavigation)
                    .FirstOrDefaultAsync(r => r.IdReserva == idReserva);

                if (reserva == null)
                {
                    Console.WriteLine("La reserva no existe.");
                    return false;
                }

                int idSala = reserva.IdFuncionNavigation.IdSala;

                // Verificar la disponibilidad de cada nueva butaca
                foreach (var idButaca in nuevasButacasIds)
                {
                    bool disponible = await CheckAvailability(reserva.IdFuncion, idButaca, idSala);
                    if (!disponible)
                    {
                        Console.WriteLine($"La butaca {idButaca} no está disponible.");
                        return false;
                    }

                    // Verificar que la butaca existe en la sala
                    bool butacaExiste = await _context.Butacas
                        .AnyAsync(b => b.IdButaca == idButaca && b.IdSala == idSala);
                    if (!butacaExiste)
                    {
                        Console.WriteLine($"La butaca con ID {idButaca} en la sala {idSala} no existe.");
                        return false;
                    }
                }

                // Eliminar las butacas reservadas anteriores
                var butacasReservadasAnteriores = _context.ButacasReservadas
                    .Where(br => br.IdReserva == idReserva);
                _context.ButacasReservadas.RemoveRange(butacasReservadasAnteriores);

                // Guardar cambios tras eliminar butacas anteriores
                await _context.SaveChangesAsync();

                // Asociar las nuevas butacas a la reserva
                foreach (var idButaca in nuevasButacasIds)
                {
                    var nuevaButacaReservada = new ButacasReservada
                    {
                        IdReserva = idReserva,
                        IdButaca = idButaca,
                        IdFuncion = reserva.IdFuncion,
                        IdSala = idSala
                    };
                    _context.ButacasReservadas.Add(nuevaButacaReservada);
                }

                // Guardar las butacas reservadas y finalizar la transacción
                var result = await _context.SaveChangesAsync() > 0;
                await transaction.CommitAsync();

                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error al actualizar las butacas: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateStatus(int id, int nuevoEstado)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return false;
            
            reserva.IdEstado = nuevoEstado;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

//      POST
//{
//    "reserva": {
//        "idCliente": 1,
//    "idFuncion": 15,
//    "fechaReserva": "2024-11-04T23:25:09.805Z",
//    "cantidadEntradas": 1,                                QUE LA CANTIDAD DE BUTACAS SEA IGUAL A LA CANTIDAD BUTACASIDS
//    "idEstado": 1,
//    "idCompra": 1
//    },
//  "butacasIds": [14, 15, 16]
//}