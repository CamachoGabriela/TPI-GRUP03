using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Implementations
{
    public class AnalisisOcupacionService : IAnalisisOcupacionService
    {
        private readonly CineMaxContext _context;
        public AnalisisOcupacionService(CineMaxContext context)
        {
            _context = context;
        }


        public async Task<List<AnalisisOcupacionResult>> ObtenerAnalisisOcupacion(DateTime fechaInicio, DateTime fechaFin)
        {
            if (fechaFin < fechaInicio)
            {
                throw new ArgumentException("La fecha final no puede ser anterior a la fecha inicial.");
            }

            var fechaInicioParam = new SqlParameter("@fecha1", fechaInicio);
            var fechaFinParam = new SqlParameter("@fecha2", fechaFin);

            return await _context.Set<AnalisisOcupacionResult>()
                                 .FromSqlRaw("EXEC pa_analisis_ocupacion @fecha1, @fecha2", fechaInicioParam, fechaFinParam)
                                 .ToListAsync();
        }
    }
}
