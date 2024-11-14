using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;
        public UsuarioController(IUsuarioService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
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

        [HttpGet("email/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            try
            {
                return Ok(await _service.GetByEmail(email));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpPost("login")] 
        public async Task<IActionResult> Login([FromBody] LogRequest request) 
        {
            try
            {
                if (request == null || !ModelState.IsValid)
                {
                    return BadRequest("Credenciales no válidas.");
                }

                var usuario = await _service.ValidarLogin(request.Email, request.Contrasenha);

                if (usuario == null)
                {
                    return Unauthorized("Credenciales incorrectas.");
                }


                var token = _service.GenerarToken(usuario);

                return Ok(new { token });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario usuario)
        {
            try
            {
                var user = new Usuario
                {
                    Email = usuario.Email,
                    Rol = usuario.Rol,
                    IdCliente = usuario.IdCliente,
                    Estado = usuario.Estado
                };
                var result = await _service.CreateUser(usuario);
                if (result)
                {
                    return Ok("Usuario registrado exitosamente.");
                }
                return BadRequest("Falló al registrar al usuario.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest("Ingrese valores válidos");
                else
                {
                    await _service.DeleteUser(id);
                    return Ok("Usuario dado de baja!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }
    }
}
