using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IDetalleButacaService
    {
        Task<List<DetalleButaca>> GetPorFuncion(int idFuncion);  
        Task<List<DetalleButaca>> GetButacasOcupadasPorFuncion(int idFuncion); 
        Task<bool> RegistrarDetalleButaca(DetalleButaca detalleButaca); 
        Task<bool> LiberarButaca(int idButaca, int idFuncion);
    }
}
