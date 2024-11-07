using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraController : ControllerBase
    {
        private ICompraService _service;

        public CompraController(ICompraService service)
        {
            _service = service;
        }

        // GET: api/<CompraController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _service.GetAll());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // GET api/<CompraController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                return Ok(await _service.GetById(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Cliente/")]
        public async Task<IActionResult> GetByClient([FromQuery] string nombreC, string apellidoC)
        {
            try
            {
                return Ok(await _service.GetByClient(nombreC, apellidoC));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Fecha/")]
        public async Task<IActionResult> GetByDate([FromQuery] DateTime fecha)
        {
            try
            {
                return Ok(await _service.GetByDate(fecha));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("FormaPago/")]
        public async Task<IActionResult> GetByFormaPago([FromQuery] int id)
        {
            try
            {
                return Ok(await _service.GetByFormaPago(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("TipoCompra/")]
        public async Task<IActionResult> GetByTipoCompra([FromQuery] int id)
        {
            try
            {
                return Ok(await _service.GetByTipoCompra(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<CompraController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Compra compra)
        {
            try
            {
                if (compra == null)
                    return BadRequest("Ingrese una compra válida");
                else
                {
                    await _service.Create(compra);
                    return Ok("Compra registrada exitosamente");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

    }
}
