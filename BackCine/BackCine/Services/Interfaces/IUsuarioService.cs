﻿using BackCine.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario?> GetByEmail(string email);
        Task<Usuario?> GetById(int id);
        Task<bool> CreateUser(Usuario usuario);
        Task<bool> CheckPassword(string email, string password);

        Task<bool> DeleteUser(int id);

        Task<Usuario?> ValidarLogin(string email, string contrasena);

        string GenerarToken(Usuario usuario);
    }
}
