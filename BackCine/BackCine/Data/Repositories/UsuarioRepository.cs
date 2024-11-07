using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly CineMaxContext _context;
        public UsuarioRepository(CineMaxContext context)
        {
            _context = context;
        }
        public async Task<bool> CheckPassword(string email, string password)
        {
            var usuario = await GetByEmail(email);
            if (usuario == null) return false;
            //return BCrypt.Net.BCrypt.Verify(password, usuario.Contrasenha);   cambiar cuando se encripte
            return usuario.Contrasenha == password;
        }

        public async Task<bool> CreateUser(Usuario usuario)
        {
            //usuario.Contrasenha = HashPassword(usuario.Contrasenha);      MANEJAR EL POST, modificar o ver como manjear tipo dato binary
            _context.Usuarios.Add(usuario);
            return await _context.SaveChangesAsync() > 0;
        }

        private string HashPassword(string contrasenha) //Encriptar contraseña
        {
            return BCrypt.Net.BCrypt.HashPassword(contrasenha); 
        }

        public async Task<bool> DeleteUser(int id)
        {
            var usuarioEliminado = await _context.Usuarios.FindAsync(id);
            if(usuarioEliminado != null)
            {
                usuarioEliminado.Estado = false;
                _context.Usuarios.Update(usuarioEliminado);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<Usuario?> GetByEmail(string email)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Usuario?> GetById(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }
    }
}
