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
    public class FuncionService : IFuncionService
    {
        private IFuncionRepository _repository;

        public FuncionService(IFuncionRepository repository)
        {
            _repository = repository;
        }
        public async Task<bool> EditarFuncion(int id, Funcione funcion)
        {
            return await _repository.Update(id, funcion);
        }

        public async Task<List<Funcione>> GetFuncionByDate(DateTime fecha)
        {
            return await _repository.GetByDate(fecha);
        }

        public async Task<List<Funcione>> GetFuncionByFilm(int idPeli)
        {
            return await _repository.GetByFilm(idPeli);
        }

        public async Task<Funcione?> GetFuncionById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<List<Funcione>> GetFunciones()
        {
            return await _repository.GetAll();
        }

        public async Task<bool> RegistrarFuncion(Funcione funcion)
        {
            return await _repository.Create(funcion);
        }

    }
}
