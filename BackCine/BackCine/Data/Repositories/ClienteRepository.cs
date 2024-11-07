using BackCine.Data;
using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private CineMaxContext _context;
        public ClienteRepository(CineMaxContext context) 
        {
            _context = context;
        }
        public async Task<bool> Create(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            return await _context.SaveChangesAsync() >  0;
        }

        public async Task<bool> Delete(int id)
        {
            var clienteEliminado = await _context.Clientes.FindAsync(id);
            if(clienteEliminado!=null)
            {
                clienteEliminado.Estado = false;
                _context.Clientes.Update(clienteEliminado);
                return await _context.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<Cliente?> GetById(int id)
        {
            return await _context.Clientes.FindAsync(id);
        }

        public async Task<List<Cliente>> GetAll()
        {
            return await _context.Clientes.Where(x => x.Estado == true).ToListAsync();
        }

        public async Task<Cliente?> GetByName(string nombre, string apellido)
        {
            return await _context.Clientes.Where(x=> x.Nombre.Equals(nombre) &&
                    x.Apellido.Equals(apellido)).FirstOrDefaultAsync();
        }

        public async Task<bool> Update(int id, Cliente cliente)
        {
            var clienteExistente = await _context.Clientes.FindAsync(id);
            if (clienteExistente == null) return false;

            clienteExistente.Calle = cliente.Calle;
            clienteExistente.Altura = cliente.Altura;
            
            _context.Update(clienteExistente);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
