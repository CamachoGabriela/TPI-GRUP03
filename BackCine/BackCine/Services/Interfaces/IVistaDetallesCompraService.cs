using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IVistaDetallesCompraService
    {
        Task<List<VisDetallesCompra>> GetDetallesComprasByDateRange(DateTime fechaInicio, DateTime fechaFin);
    }
}
