using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly CineMaxContext _context;
        private readonly IConfiguration _config;
        public UsuarioRepository(CineMaxContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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

        public async Task<Usuario?> ValidarLogin(string email, string contrasena)
        {
            // Obtén el usuario desde la base de datos utilizando el email
            var usuario = await GetByEmail(email);

            if (usuario != null)
            {
                // Comparar la contraseña ingresada con la contraseña almacenada (sin hashing)
                if (contrasena == usuario.Contrasenha)
                {
                    return usuario;  // Las credenciales son correctas
                }
                else
                {
                    return null;  // Credenciales incorrectas
                }
            }

            return null;  // No se encontró el usuario
        }

        public string GenerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol)
            };

            // Asegúrate de que la clave secreta no sea nula
            string secretKey = _config["Jwt:Key"];  // Cambia esto por una clave adecuada y segura

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));  // Convierte la clave secreta en bytes
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
