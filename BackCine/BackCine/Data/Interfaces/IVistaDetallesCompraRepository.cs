using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IVistaDetallesCompraRepository
    {
        Task<List<VisDetallesCompra>> GetDetallesComprasByDateRange(DateTime fechaInicio, DateTime fechaFin);
    }
}
