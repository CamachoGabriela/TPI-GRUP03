using BackCine.Data;
using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionController : ControllerBase
    {
        private readonly IFuncionService _service;
        public FuncionController(IFuncionService service)
        {
            _service = service;
        }
        // GET: api/<FuncionController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _service.GetFunciones());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // GET api/<FuncionController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                return Ok(await _service.GetFuncionById(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Fecha/{fecha}")]
        public async Task<IActionResult> GetByFecha(DateTime fecha )
        {
            try
            {
                return Ok(await _service.GetFuncionByDate(fecha));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Film/{id}")]
        public async Task<IActionResult> GetByFilm(int id)
        {
            try
            {
                return Ok(await _service.GetFuncionByFilm(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<FuncionController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Funcione funcion)
        {
            try
            {
                if (funcion == null)
                    return BadRequest("Ingrese una función válida");
                else
                {
                    await _service.RegistrarFuncion(funcion);
                    return Ok("Función registrada exitosamente");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // PUT api/<FuncionController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Funcione funcion)
        {
            try
            {
                if (funcion == null)
                    return BadRequest("Debe ingresar los datos de la función");
                if (id == 0 || id == null)
                    return NotFound("Función no encontrada!");
                else
                {
                    await _service.EditarFuncion(id, funcion);
                    return Ok("Función actualizada exitosamente");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

    }
}
