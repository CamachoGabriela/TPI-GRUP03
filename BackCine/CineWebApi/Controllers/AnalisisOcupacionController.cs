using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalisisOcupacionController : ControllerBase
    {
        private readonly IAnalisisOcupacionService _service;
        public AnalisisOcupacionController(IAnalisisOcupacionService service)
        {
            _service = service;
        }

        [HttpGet("ocupacion")]
        public async Task<IActionResult> GetAnalisisOcupacion(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var resultado = await _service.ObtenerAnalisisOcupacion(fechaInicio, fechaFin);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al ejecutar el análisis de ocupación. { ex.Message}" );
            }
        }
    }
}
