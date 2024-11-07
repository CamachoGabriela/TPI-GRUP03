using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetByEmail(string email); 
        Task<Usuario?> GetById(int id);          
        Task<bool> CreateUser(Usuario usuario);  
        Task<bool> CheckPassword(string email, string password);

        Task<bool> DeleteUser(int id);
    }
}
