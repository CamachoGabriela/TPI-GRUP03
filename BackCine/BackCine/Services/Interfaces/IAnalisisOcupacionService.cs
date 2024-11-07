using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IAnalisisOcupacionService
    {
        Task<List<AnalisisOcupacionResult>> ObtenerAnalisisOcupacion(DateTime fechaInicio, DateTime fechaFin);
    }
}
