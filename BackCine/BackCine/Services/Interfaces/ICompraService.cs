using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface ICompraService
    {
        Task<List<Compra>> GetAll();
        Task<Compra?> GetById(int id);
        Task<List<Compra>> GetByDate(DateTime fecha);
        Task<List<Compra>> GetByClient(string nombreC, string apellidoC);
        Task<List<Compra>> GetByTipoCompra(int idTipo);
        Task<List<Compra>> GetByFormaPago(int idForma);
        Task<bool> Create(Compra compra);
        /*
        Task<bool> Update(int id, Compra compra);
        Task<bool> Delete(int id);
        */

    }
}
