using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetalleButacaController : ControllerBase
    {
        private readonly IDetalleButacaService _service;
        public DetalleButacaController(IDetalleButacaService service)
        {
            _service = service;
        }
        // GET: api/<DetalleButacaController>
        [HttpGet("Función/{id}")]
        public async Task<IActionResult> GetPorFuncion(int id)
        {
            try
            {
                return Ok(await _service.GetPorFuncion(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // GET api/<DetalleButacaController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetButacasOcupadas(int id)
        {
            try
            {
                return Ok(await _service.GetButacasOcupadasPorFuncion(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<DetalleButacaController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DetalleButaca detalle)
        {
            try
            {
                if (detalle == null)
                    return BadRequest("Ingrese un detalle válido");
                else
                {
                    await _service.RegistrarDetalleButaca(detalle);
                    return Ok("Detalle registrado exitosamente");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // DELETE api/<DetalleButacaController>/5
        [HttpDelete("{idFuncion}")]
        public async Task<IActionResult> Delete([FromQuery] int idButaca, int idFuncion)
        {
            try
            {
                if (idButaca == null || idFuncion == null)
                    return BadRequest("Ingrese valores válidos");
                else
                {
                    await _service.LiberarButaca(idButaca, idFuncion);
                    return Ok("Detalle eliminado!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }
    }
}
