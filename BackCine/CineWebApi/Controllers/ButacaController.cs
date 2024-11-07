using BackCine.Services.Implementations;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ButacaController : ControllerBase
    {
        private readonly IButacaService _service;
        public ButacaController(IButacaService service)
        {
            _service = service;
        }

        // GET api/<ButacaController>/5
        [HttpGet("Sala/{id}")]
        public async Task<IActionResult> GetSala(int id)
        {
            try
            {
                return Ok(await _service.ButacasPorSala(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }


        [HttpGet("Funcion/{id}")]
        public async Task<IActionResult> GetFuncion(int id)
        {
            try
            {
                return Ok(await _service.ButacasDisponiblesPorFuncion(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetButacas([FromQuery] int idButaca, [FromQuery] int idSala, [FromQuery] int idFuncion)
        {
            try
            {
                return Ok(await _service.ButacasById(idButaca, idSala, idFuncion));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("EstaDisponible/")]
        public async Task<IActionResult> GetDisponible([FromQuery] int idSala, [FromQuery] int idFuncion, [FromQuery] int idButaca)
        {
            try
            {
                var response = await _service.VerDisponibilidad(idSala, idFuncion, idButaca);
                if (response)
                    return Ok("Butaca Disponible");
                return Ok("Butaca Ocupada");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("DisponibilidadPeliFecha/")]
        public async Task<IActionResult> VerificarDisponibilidad([FromQuery] string titulo, [FromQuery] DateTime fecha)
        {
            try
            {
                var disponibilidad = await _service.VerificarDisponibilidad(titulo, fecha);

                if (disponibilidad > 0)
                {
                    return Ok($"Hay {disponibilidad} butacas disponibles para {titulo} el {fecha.ToShortDateString()}.");
                }
                else
                {
                    return Ok("No hay butacas disponibles para la función seleccionada.");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }
    }
}
