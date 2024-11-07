using BackCine.Data;
using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using BackCine.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Implementations
{
    public class ClienteService : IClienteService
    {
        private IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> EditarCliente(int id, Cliente cliente)
        {
            return await _repository.Update(id, cliente);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _repository.Delete(id);
        }

        public async Task<Cliente?> FiltrarClientePorNombre(string nombre, string apellido)
        {
            return await _repository.GetByName(nombre, apellido);
        }

        public async Task<Cliente?> GetClienteById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<List<Cliente>> GetClientes()
        {
            return await _repository.GetAll();
        }

        public async Task<bool> RegistrarCliente(Cliente cliente)
        {
            return await _repository.Create(cliente);
        }
    }
}
