using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IDetallesCompraRepository
    {
        Task<List<DetallesCompra>> GetAll();
        Task<DetallesCompra?> GetById(int id);
        Task<List<DetallesCompra>> GetByIdBuy(int idCompra);
        Task<List<DetallesCompra>> GetByMaxPrice(decimal cant);
        Task<List<DetallesCompra>> GetByFunction(int idFuncion);
        Task<bool> Create(DetallesCompra detallesCompra);
        /*
        Task<bool> Update(int id, DetallesCompra detallesCompra);
        Task<bool> Delete(int id);
        */

    }
}
