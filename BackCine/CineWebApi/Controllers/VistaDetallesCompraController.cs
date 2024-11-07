using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VistaDetallesCompraController : ControllerBase
    {
        private readonly IVistaDetallesCompraService _service;

        public VistaDetallesCompraController(IVistaDetallesCompraService service)
        {
           _service = service;
        }

        [HttpGet("detalles-por-fecha")]
        public async Task<IActionResult> GetDetallesComprasByDateRange(DateTime fechaInicio, DateTime fechaFin)
        {
            try
            {
                var detallesCompras = await _service.GetDetallesComprasByDateRange(fechaInicio, fechaFin);
                return Ok(detallesCompras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
           
        }
    }
}
