using BackCine.Data;
using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IClienteService
    {
        Task<List<Cliente>> GetClientes();
        Task<Cliente?> GetClienteById(int id);
        Task<Cliente?> FiltrarClientePorNombre(string nombre, string apellido);
        Task<List<TiposDocumento>> GetTiposDocumento();
        Task<List<Barrio>> GetBarrios();
        Task<bool> RegistrarCliente(Cliente cliente);
        Task<bool> EditarCliente(int id, ClienteUpdate cliente);
        Task<bool> Eliminar(int id);
    }
}
