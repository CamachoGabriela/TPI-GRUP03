using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallesCompraController : ControllerBase
    {
        private IDetallesCompraService _service;

        public DetallesCompraController(IDetallesCompraService service)
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

        [HttpGet("Funcion/{id}")]
        public async Task<IActionResult> GetByFunction(int id)
        {
            try
            {
                return Ok(await _service.GetByFunction(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Compra/{id}")]
        public async Task<IActionResult> GetByIdBuy(int id)
        {
            try
            {
                return Ok(await _service.GetByIdBuy(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("PrecioMaximo")]
        public async Task<IActionResult> GetByMaxPrice([FromQuery] decimal cant)
        {
            try
            {
                return Ok(await _service.GetByMaxPrice(cant));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<CompraController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DetallesCompra detallesCompra)
        {
            try
            {
                if (detallesCompra == null)
                    return BadRequest("Ingrese un detalle válido");
                else
                {
                    await _service.Create(detallesCompra);
                    return Ok("Detalle de compra registrado exitosamente");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

    }
}
