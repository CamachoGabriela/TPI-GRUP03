using BackCine.Data.Entities;
using BackCine.Data.Interfaces;
using BackCine.Data.Repositories;
using BackCine.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Services.Implementations
{
    public class ButacaService : IButacaService
    {
        private readonly IButacaRepository _repository;
        public ButacaService(IButacaRepository repository)
        {
            _repository = repository;
        }

        public async Task<Butaca?> ButacasById(int idButaca, int idSala, int idFuncion)
        {
            return await _repository.GetById(idButaca, idSala, idFuncion);
        }

        public async Task<List<Butaca>> ButacasDisponiblesPorFuncion(int idFuncion)
        {
            return await _repository.GetAvailableByFuncion(idFuncion);
        }

        public async Task<List<Butaca>> ButacasPorSala(int idSala)
        {
            return await _repository.GetAllbySala(idSala);
        }

        public async Task<bool> VerDisponibilidad(int idSala, int idFuncion, int idButaca)
        {
            return await _repository.IsAvailable(idSala, idFuncion, idButaca);
        }

        public async Task<int> VerificarDisponibilidad(string tituloPelicula, DateTime fecha)
        {
            return await _repository.VerificarDisponibilidad(tituloPelicula, fecha);
        }
    }
}
