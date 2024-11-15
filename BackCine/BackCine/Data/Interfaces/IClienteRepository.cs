using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAll();
        Task<Cliente?> GetById(int id);
        Task<Cliente?> GetByName(string nombre, string apellido);
        Task<List<TiposDocumento>> GetTiposDocumento();
        Task<List<Barrio>> GetBarrios();
        Task<bool> Create(Cliente cliente);
        Task<bool> Update(int id, ClienteUpdate cliente);
        Task<bool> Delete(int id);
    }
}
