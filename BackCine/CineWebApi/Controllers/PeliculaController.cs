using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeliculaController : ControllerBase
    {
        private readonly IPeliculaService _service;

        public PeliculaController(IPeliculaService service)
        {
            _service = service;
        }
        // GET: api/<PeliculaController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _service.GetFilms());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // GET api/<PeliculaController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                return Ok(await _service.GetFilmById(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Titulo/{titulo}")]
        public async Task<IActionResult> GetByTitle(string titulo)
        {
            try
            {
                return Ok(await _service.GetFilmByTitle(titulo));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Genero/{genero}")]
        public async Task<IActionResult> GetByFecha(string genero)
        {
            try
            {
                return Ok(await _service.GetFilmByGenre(genero));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<PeliculaController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Pelicula pelicula)
        {
            try
            {
                if (pelicula == null)
                    return BadRequest("Ingrese una película válida");
                else
                {
                    await _service.CrearPelicula(pelicula);
                    return Ok("Película registradoa exitosamente");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // PUT api/<PeliculaController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Pelicula pelicula)
        {
            try
            {
                if (pelicula == null)
                    return BadRequest("Debe ingresar los datos de la película");
                if (id == 0 || id == null)
                    return NotFound("Película no encontrada!");
                else
                {
                    await _service.EditarPelicula(id, pelicula);
                    return Ok("Película actualizada exitosamente");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // DELETE api/<PeliculaController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id == null)
                    return BadRequest("Ingrese valores válidos");
                else
                {
                    await _service.EliminarPelicula(id);
                    return Ok("Película dada de baja!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }
    }
}
