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
            var usuarioEliminado = await _context.Usuarios.Where(x => x.IdCliente == id).FirstOrDefaultAsync();
            if (clienteEliminado != null && usuarioEliminado != null)
            {
                clienteEliminado.Estado = false;
                usuarioEliminado.Estado = false;
                _context.Clientes.Update(clienteEliminado);
                _context.Usuarios.Update(usuarioEliminado);
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

        public async Task<bool> Update(int id, ClienteUpdate cliente)
        {
            var clienteExistente = await _context.Clientes.FindAsync(id);
            if (clienteExistente == null) return false;

            if (cliente.IdBarrio != -1)
            {
                clienteExistente.IdBarrio = Convert.ToInt32(cliente.IdBarrio);
            }
            if (cliente.Calle != "nulo")
            {
                clienteExistente.Calle = cliente.Calle;
            }
            if (cliente.Altura != -1)
            {
                clienteExistente.Altura = Convert.ToInt32(cliente.Altura);
            }

            _context.Update(clienteExistente);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<TiposDocumento>> GetTiposDocumento()
        {
            return await _context.TiposDocumentos.ToListAsync();
        }
        public async Task<List<Barrio>> GetBarrios()
        {
            return await _context.Barrios.Where(x => x.IdCiudad==1).ToListAsync();
        }
    }
}
