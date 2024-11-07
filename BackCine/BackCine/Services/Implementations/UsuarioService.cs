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
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;
        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> CheckPassword(string email, string password)
        {
            return await _repository.CheckPassword(email, password);
        }

        public async Task<bool> CreateUser(Usuario usuario)
        {
            return await _repository.CreateUser(usuario);
        }

        public async Task<bool> DeleteUser(int id)
        {
            return await _repository.DeleteUser(id);
        }

        public async Task<Usuario?> GetByEmail(string email)
        {
            return await _repository.GetByEmail(email);
        }

        public async Task<Usuario?> GetById(int id)
        {
            return await _repository.GetById(id);
        }
    }
}
